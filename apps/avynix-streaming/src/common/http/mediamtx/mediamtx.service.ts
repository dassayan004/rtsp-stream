import {
  GlobalConfigUpdate,
  PathConfig,
  StreamItem,
  StreamListResponse,
} from '@/common/types';
import { handleHttpRequest } from '@/common/utils';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MediamtxService {
  constructor(private readonly httpService: HttpService) {}

  // ---------------- CONFIG ----------------
  async patchGlobalConfig(update: GlobalConfigUpdate) {
    return handleHttpRequest(
      this.httpService.patch('/config/global/patch', update),
    );
  }

  async getGlobalConfig() {
    return handleHttpRequest(this.httpService.get('/config/global/get'));
  }

  // ---------------- PATH CONFIG ----------------
  async listPathConfigs() {
    return handleHttpRequest(this.httpService.get('/config/paths/list'));
  }

  async getPathConfig(streamId: string) {
    return handleHttpRequest(
      this.httpService.get(`/config/paths/get/${streamId}`),
    );
  }

  async addPathConfig(streamId: string, conf: PathConfig) {
    return handleHttpRequest(
      this.httpService.post(`/config/paths/add/${streamId}`, conf),
    );
  }

  async deletePathConfig(streamId: string) {
    return handleHttpRequest(
      this.httpService.delete(`/config/paths/delete/${streamId}`),
    );
  }

  // ---------------- ACTIVE PATHS ----------------
  async listActivePaths(): Promise<StreamListResponse> {
    return handleHttpRequest<StreamListResponse>(
      this.httpService.get<StreamListResponse>('/paths/list'),
    );
  }

  async getActivePath(streamId: string): Promise<StreamItem> {
    return handleHttpRequest<StreamItem>(
      this.httpService.get<StreamItem>(`/paths/get/${streamId}`),
    );
  }
}
