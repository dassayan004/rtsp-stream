// app/api/mediamtx/startStream/route.ts
import {
  addPathConfig,
  deletePathConfig,
  getActivePath,
} from "@/lib/mediamtxClient.server";
import {
  PathConfig,
  Protocol,
  StartStreamDTO,
  StartStreamResponse,
} from "@/lib/utils";
import { NextResponse } from "next/server";

const HLS_BASE = process.env.MEDIAMTX_HLS_BASE ?? "http://localhost:8888";
const WEBRTC_BASE = process.env.MEDIAMTX_WEBRTC_BASE ?? "http://localhost:8889";
const POLL_INTERVAL_MS = 1000;
const MAX_WAIT_MS = 5000;

async function waitForStreamReady(path: string) {
  const start = Date.now();
  let lastData = null;

  while (Date.now() - start < MAX_WAIT_MS) {
    const data = await getActivePath(path);
    lastData = data;

    if (data?.ready) {
      console.log(`Stream ${path} is ready`);
      return true;
    }

    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
  }

  console.warn(
    `Stream ${path} not ready after ${MAX_WAIT_MS / 1000}s`,
    lastData
  );
  return false;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as StartStreamDTO;
    const { rtspUrl, protocol } = body;

    if (!rtspUrl)
      return NextResponse.json({ error: "rtspUrl required" }, { status: 400 });

    if (!Object.values(Protocol).includes(protocol)) {
      return NextResponse.json(
        { error: "protocol must be 'hls' or 'webrtc'" },
        { status: 400 }
      );
    }

    const path = `stream_${Date.now()}`;
    const conf: PathConfig = {
      source: rtspUrl,
      sourceOnDemand: false,
    };

    await addPathConfig(path, conf);

    const isReady = await waitForStreamReady(path);
    if (!isReady) {
      await deletePathConfig(path);
      return NextResponse.json(
        { error: `Stream not ready after ${MAX_WAIT_MS / 1000}s` },
        { status: 504 }
      );
    }
    const url =
      protocol === Protocol.HLS
        ? `${HLS_BASE}/${path}/index.m3u8`
        : `${WEBRTC_BASE}/${path}/whep`;

    const response: StartStreamResponse = {
      path,
      protocol,
      url,
    };

    return NextResponse.json(response);
  } catch (err: unknown) {
    return NextResponse.json(
      { error: (err as Error).message ?? "Failed to start stream" },
      { status: 500 }
    );
  }
}
