import { InternalServerErrorException } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { firstValueFrom, Observable } from 'rxjs';

export async function handleHttpRequest<T>(
  request$: Observable<AxiosResponse<T>>,
): Promise<T> {
  try {
    const { data } = await firstValueFrom(request$);
    return data;
  } catch (err: unknown) {
    throw new InternalServerErrorException(
      (err as Error).message ?? 'HTTP request failed',
    );
  }
}
