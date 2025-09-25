import { ConfigSchema } from '@/common/config/schema';
import {
  GlobalConfigUpdate,
  PathConfig,
  StreamItem,
  StreamListResponse,
} from '@/common/types';
import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { firstValueFrom, Observable } from 'rxjs';

@Injectable()
export class MediamtxService {
  constructor(private readonly httpService: HttpService) {}
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
}
