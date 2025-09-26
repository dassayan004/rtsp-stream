"use client";
import { useState, useRef } from "react";
import Hls from "hls.js";
import { useStartStream, useCameraInactive } from "@/hooks/useMediamtx";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Protocol, StartStreamDTO } from "@/lib/utils";
import { addCamera, updateCameraStreaming } from "@/firebase/service";

export default function LiveFeedPage() {
  const [rtspUrl, setRtspUrl] = useState("");
  const [streamId, setStreamId] = useState<string | null>(null);
  const [cameraId, setCameraId] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null); // hidden video
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const animationRef = useRef<number | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);

  const { mutateAsync: hlsMutation, isPending: isHlsPending } =
    useStartStream();
  const { mutateAsync: webRtcMutation, isPending: isWebRtcPending } =
    useStartStream();

  const { mutateAsync: markCameraInactiveMutation, isPending: isInactivating } =
    useCameraInactive();

  const drawToCanvas = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    const drawFrame = () => {
      ctx.drawImage(
        videoRef.current!,
        0,
        0,
        canvasRef.current!.width,
        canvasRef.current!.height
      );
      animationRef.current = requestAnimationFrame(drawFrame);
    };
    drawFrame();
  };
  const showCanvasError = (message: string) => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctx.fillStyle = "#ff0000";
    ctx.font = "24px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(
      message,
      canvasRef.current.width / 2,
      canvasRef.current.height / 2
    );
  };
  const startHls = async () => {
    if (!rtspUrl) return alert("Enter RTSP URL");
    const body: StartStreamDTO = { rtspUrl, protocol: Protocol.HLS };
    const { streamId, url: hlsUrl } = await hlsMutation(body);

    setStreamId(streamId);
    const camera = await addCamera({
      rtspUrl,
      streamId,
      url: hlsUrl,
      name: `Camera ${streamId.split("_")[1]}`,
      protocol: Protocol.HLS,
    });
    setCameraId(camera.id);
    if (Hls.isSupported() && videoRef.current) {
      const hls = new Hls();
      hls.loadSource(hlsUrl);
      hls.attachMedia(videoRef.current);
      hls.on(Hls.Events.ERROR, (data) => {
        console.error("HLS error:", data);
        showCanvasError("HLS stream failed");
      });
      hlsRef.current = hls;
      videoRef.current
        .play()
        .then(async () => {
          await updateCameraStreaming(camera.id, true);
        })
        .catch(() => showCanvasError("Unable to play video"));

      drawToCanvas();
    } else if (videoRef.current?.canPlayType("application/vnd.apple.mpegurl")) {
      videoRef.current.src = hlsUrl;
      videoRef.current
        .play()
        .then(async () => {
          await updateCameraStreaming(camera.id, true);
        })
        .catch(() => showCanvasError("Unable to play video"));

      drawToCanvas();
    }
  };

  const startWebRtc = async () => {
    if (!rtspUrl) return alert("Enter RTSP URL");
    const body: StartStreamDTO = { rtspUrl, protocol: Protocol.WEBRTC };
    const { streamId, url: webrtcUrl } = await webRtcMutation(body);
    setStreamId(streamId);
    const camera = await addCamera({
      rtspUrl,
      streamId,
      name: `Camera ${streamId.split("_")[1]}`,
      url: webrtcUrl,
      protocol: Protocol.WEBRTC,
    });
    setCameraId(camera.id);
    try {
      if (!pcRef.current) {
        pcRef.current = new RTCPeerConnection();
        pcRef.current.addTransceiver("video", { direction: "recvonly" });
        pcRef.current.addTransceiver("audio", { direction: "recvonly" });

        pcRef.current.ontrack = (event) => {
          if (videoRef.current) {
            videoRef.current.srcObject = event.streams[0];

            const handleLoaded = async () => {
              videoRef.current
                ?.play()
                .then(async () => {
                  await updateCameraStreaming(camera.id, true);
                })
                .catch((err) => {
                  console.error("Failed to play WebRTC video:", err);
                  showCanvasError("Unable to play WebRTC stream");
                });

              drawToCanvas();
              videoRef.current?.removeEventListener(
                "loadedmetadata",
                handleLoaded
              );
            };

            videoRef.current.addEventListener("loadedmetadata", handleLoaded);
          }
        };

        pcRef.current.createDataChannel("chat");
      }

      const pc = pcRef.current;
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const fetchSDP = async () => {
        const res = await fetch(webrtcUrl, {
          method: "POST",
          headers: { "Content-Type": "application/sdp" },
          body: offer.sdp,
        });
        if (!res.ok)
          throw new Error(
            `WebRTC SDP request failed with status ${res.status}`
          );
        const answerSdp = await res.text();

        await pc.setRemoteDescription({ type: "answer", sdp: answerSdp });
      };

      try {
        await fetchSDP();
      } catch (err) {
        console.warn("Retrying WebRTC SDP due to failure:", err);
        await new Promise((r) => setTimeout(r, 500));
        await fetchSDP();
      }
    } catch (err) {
      console.error("WebRTC error:", err);
      showCanvasError("WebRTC stream failed");
    }
  };

  const stopStream = async () => {
    if (!streamId) return;

    setStreamId(null);
    if (cameraId) {
      await markCameraInactiveMutation(cameraId);
      setCameraId(null);
    }
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.src = "";
      videoRef.current.srcObject = null;
    }

    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };
  return (
    <Card className="p-4 space-y-4">
      <CardHeader>
        <CardTitle>Live Feed Viewer (Canvas)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="Enter RTSP URL"
          value={rtspUrl}
          onChange={(e) => setRtspUrl(e.target.value)}
        />
        <div className="flex gap-2">
          <Button variant="default" onClick={startHls} disabled={isHlsPending}>
            Start HLS
          </Button>
          <Button
            variant="secondary"
            onClick={startWebRtc}
            disabled={isWebRtcPending}
          >
            Start WebRTC
          </Button>
          <Button
            variant="destructive"
            onClick={stopStream}
            disabled={!streamId || isInactivating}
          >
            Stop Stream
          </Button>
        </div>
        <canvas
          ref={canvasRef}
          width={800}
          height={500}
          className="bg-black rounded"
        ></canvas>
        <video ref={videoRef} style={{ display: "none" }}></video>
      </CardContent>
    </Card>
  );
}
