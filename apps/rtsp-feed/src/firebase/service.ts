import { onDisconnect, push, ref, set, update } from "firebase/database";
import firebaseDatabase from "./firebase";
import { CameraDevice, Protocol } from "@/lib/utils";

export async function addCamera({
  rtspUrl,
  streamId,
  name,
  url,
  protocol,
}: {
  rtspUrl: string;
  streamId: string;
  name: string;
  url: string;
  protocol: Protocol;
}) {
  try {
    const camerasRef = ref(firebaseDatabase, "/camera_devices");
    const newCameraRef = push(camerasRef);
    const cameraId = newCameraRef.key!;

    const newCamera: CameraDevice = {
      id: cameraId,
      name,
      rtsp_url: rtspUrl,
      isActive: true,
      isStreaming: false,
      users: [],
      ...(protocol === Protocol.HLS && {
        stream_id_hls: streamId,
        hls_url: url,
      }),
      ...(protocol === Protocol.WEBRTC && {
        stream_id_webrtc: streamId,
        webrtc_url: url,
      }),
    };

    await set(newCameraRef, newCamera);
    console.log(`Stream ${streamId} was added under cameraId ${cameraId}`);
    return newCamera;
  } catch (error) {
    console.error("Failed to add stream:", error);
    throw error;
  }
}

export async function updateCameraStreaming(
  cameraId: string,
  isStreaming: boolean
) {
  try {
    const cameraRef = ref(firebaseDatabase, `/camera_devices/${cameraId}`);
    await update(cameraRef, { isStreaming });
    console.log(
      `Camera ${cameraId} streaming status updated to ${isStreaming}`
    );
    await onDisconnect(cameraRef).update({ isStreaming: false });
  } catch (error) {
    console.error(`Failed to update streaming for camera ${cameraId}:`, error);
    throw error;
  }
}

export async function markCameraInactive(cameraId: string) {
  try {
    const cameraRef = ref(firebaseDatabase, `/camera_devices/${cameraId}`);
    await update(cameraRef, { isStreaming: false });
    console.log(`Camera ${cameraId} marked as streaming false`);
  } catch (error) {
    console.error(`Failed to update streaming for camera ${cameraId}:`, error);
    throw error;
  }
}
