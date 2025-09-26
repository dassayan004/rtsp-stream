import { GatewayTimeoutException, Injectable, Logger } from '@nestjs/common';

import {
  PathConfig,
  StartStreamResponse,
  StreamListResponse,
} from '@/common/types';
import { ConfigService } from '@nestjs/config';
import { ConfigSchema } from '@/common/config/schema';
import { StartStreamDTO } from './dto/create-streaming.dto';
import { Protocol } from '@/common/enum/protocol.enum';
import { MediamtxService } from '@/common/http/mediamtx/mediamtx.service';
import { FirebaseService } from '@/firebase/firebase.service';
const POLL_INTERVAL_MS = 1000;
const MAX_WAIT_MS = 5000;
@Injectable()
export class StreamingService {
  private readonly hlsBase: string;
  private readonly webrtcBase: string;

  constructor(
    private readonly mediaMtx: MediamtxService,
    private readonly firebaseService: FirebaseService,
    private readonly configService: ConfigService<ConfigSchema, true>,
  ) {
    this.hlsBase = this.configService.get<string>(
      'MEDIAMTX_HLS_BASE',
      'http://localhost:8888',
    );
    this.webrtcBase = this.configService.get<string>(
      'MEDIAMTX_WEBRTC_BASE',
      'http://localhost:8889',
    );
  }
  async listActivePaths(): Promise<StreamListResponse> {
    return await this.mediaMtx.listActivePaths();
  }
  private async waitForStreamReady(streamId: string): Promise<void> {
    const start = Date.now();
    let lastData: unknown = null;

    while (Date.now() - start < MAX_WAIT_MS) {
      try {
        const data = await this.mediaMtx.getActivePath(streamId);

        lastData = data;
        if (data?.ready) return;
      } catch (err) {
        Logger.warn(
          `Error fetching streamId status: ${(err as Error).message}`,
        );
      }
      await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
    }

    Logger.warn(
      `Stream ${streamId} not ready after ${MAX_WAIT_MS / 1000}s`,
      lastData,
    );
    throw new GatewayTimeoutException(
      `Stream not ready after ${MAX_WAIT_MS / 1000}s`,
    );
  }

  async startStream({
    rtspUrl,
    protocol,
  }: StartStreamDTO): Promise<StartStreamResponse> {
    const streamId = `stream_${Date.now()}`;
    const conf: PathConfig = { source: rtspUrl, sourceOnDemand: false };

    try {
      await this.mediaMtx.addPathConfig(streamId, conf);
      await this.waitForStreamReady(streamId);

      const url =
        protocol === Protocol.HLS
          ? `${this.hlsBase}/${streamId}/index.m3u8`
          : `${this.webrtcBase}/${streamId}/whep`;

      return { streamId, protocol: protocol, url };
    } catch (err) {
      await this.mediaMtx.deletePathConfig(streamId).catch(() => null);
      throw err;
    }
  }

  async stopStream(streamId: string) {
    await this.mediaMtx.deletePathConfig(streamId);
    return { success: true };
  }
}
