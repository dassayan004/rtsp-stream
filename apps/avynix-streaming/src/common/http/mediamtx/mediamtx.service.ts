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

  async getPathConfig(name: string) {
    return handleHttpRequest(this.httpService.get(`/config/paths/get/${name}`));
  }

  async addPathConfig(name: string, conf: PathConfig) {
    return handleHttpRequest(
      this.httpService.post(`/config/paths/add/${name}`, conf),
    );
  }

  async deletePathConfig(pathName: string) {
    return handleHttpRequest(
      this.httpService.delete(`/config/paths/delete/${pathName}`),
    );
  }

  // ---------------- ACTIVE PATHS ----------------
  async listActivePaths(): Promise<StreamListResponse> {
    return handleHttpRequest<StreamListResponse>(
      this.httpService.get<StreamListResponse>('/paths/list'),
    );
  }

  async getActivePath(name: string): Promise<StreamItem> {
    return handleHttpRequest<StreamItem>(
      this.httpService.get<StreamItem>(`/paths/get/${name}`),
    );
  }
}
