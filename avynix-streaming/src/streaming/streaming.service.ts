import {
  GatewayTimeoutException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

import { HttpService } from '@nestjs/axios';
import { firstValueFrom, Observable } from 'rxjs';
import {
  GlobalConfigUpdate,
  PathConfig,
  StartStreamResponse,
  StreamItem,
  StreamListResponse,
} from '@/common/types';
import { AxiosResponse } from 'axios';
import { ConfigService } from '@nestjs/config';
import { ConfigSchema } from '@/common/config/schema';
import { StartStreamDTO } from './dto/create-streaming.dto';
import { Protocol } from '@/common/enum/protocol.enum';
const POLL_INTERVAL_MS = 1000;
const MAX_WAIT_MS = 5000;
@Injectable()
export class StreamingService {
  private readonly hlsBase: string;
  private readonly webrtcBase: string;

  constructor(
    private readonly httpService: HttpService,
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

  private async handleRequest<T>(
    request$: Observable<AxiosResponse<T>>,
  ): Promise<T> {
    try {
      const response = await firstValueFrom(request$);
      return response.data;
    } catch (err: unknown) {
      const message = (err as Error).message ?? 'MediaMTX request failed';
      throw new InternalServerErrorException(message);
    }
  }
  // ---------------- CONFIG ----------------
  async patchGlobalConfig(update: GlobalConfigUpdate) {
    return this.handleRequest(
      this.httpService.patch('/config/global/patch', update),
    );
  }

  async getGlobalConfig() {
    return this.handleRequest(this.httpService.get('/config/global/get'));
  }

  // ---------------- PATH CONFIG ----------------
  async listPathConfigs() {
    return this.handleRequest(this.httpService.get('/config/paths/list'));
  }

  async getPathConfig(name: string) {
    return this.handleRequest(
      this.httpService.get(`/config/paths/get/${name}`),
    );
  }

  async addPathConfig(name: string, conf: PathConfig) {
    return this.handleRequest(
      this.httpService.post(`/config/paths/add/${name}`, conf),
    );
  }

  async deletePathConfig(pathName: string) {
    return this.handleRequest(
      this.httpService.delete(`/config/paths/delete/${pathName}`),
    );
  }

  // ---------------- ACTIVE PATHS ----------------
  async listActivePaths(): Promise<StreamListResponse> {
    return this.handleRequest<StreamListResponse>(
      this.httpService.get<StreamListResponse>('/paths/list'),
    );
  }

  async getActivePath(name: string): Promise<StreamItem> {
    return this.handleRequest<StreamItem>(
      this.httpService.get<StreamItem>(`/paths/get/${name}`),
    );
  }

  private async waitForStreamReady(path: string): Promise<void> {
    const start = Date.now();
    let lastData: unknown = null;

    while (Date.now() - start < MAX_WAIT_MS) {
      try {
        const data = await this.getActivePath(path);

        lastData = data;
        if (data?.ready) return;
      } catch (err) {
        Logger.warn(`Error fetching path status: ${(err as Error).message}`);
      }
      await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
    }

    Logger.warn(
      `Stream ${path} not ready after ${MAX_WAIT_MS / 1000}s`,
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
    const path = `stream_${Date.now()}`;
    const conf: PathConfig = { source: rtspUrl, sourceOnDemand: false };

    try {
      await this.addPathConfig(path, conf);
      await this.waitForStreamReady(path);

      const url =
        protocol === Protocol.HLS
          ? `${this.hlsBase}/${path}/index.m3u8`
          : `${this.webrtcBase}/${path}/whep`;

      return { path, protocol: protocol, url };
    } catch (err) {
      await this.deletePathConfig(path).catch(() => null);
      throw err;
    }
  }

  async stopStream(pathName: string) {
    await this.deletePathConfig(pathName);
    return { success: true };
  }
}
