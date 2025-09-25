// import { ConfigSchema } from '@/common/config/schema';
// import { HttpService } from '@nestjs/axios';
// import { Injectable, InternalServerErrorException } from '@nestjs/common';
// import { AxiosResponse } from 'axios';
// import { firstValueFrom, Observable } from 'rxjs';

// @Injectable()
// export class OtherApiService {
//   constructor(private readonly httpService: HttpService) {}
//   private async handleRequest<T>(
//     request$: Observable<AxiosResponse<T>>,
//   ): Promise<T> {
//     try {
//       const response = await firstValueFrom(request$);
//       return response.data;
//     } catch (err: unknown) {
//       const message = (err as Error).message ?? 'MediaMTX request failed';
//       throw new InternalServerErrorException(message);
//     }
//   }
//   async getSomeData(): Promise<{ status: string; method: string }> {
//     return this.handleRequest(this.httpService.get('/test'));
//   }
// }
