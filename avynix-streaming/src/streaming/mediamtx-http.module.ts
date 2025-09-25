// src/mediamtx/mediamtx-http.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ConfigSchema } from '@/common/config/schema';

@Module({
  imports: [
    HttpModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<ConfigSchema, true>) => ({
        baseURL:
          configService.get<string>(
            'MEDIAMTX_CONTROL_BASE',
            'http://mediamtx:9997',
          ) + '/v3',
        timeout: 10000,
        auth: {
          username: configService.get<string>('MEDIAMTX_USER', 'admin'),
          password: configService.get<string>('MEDIAMTX_PASS', 'admin'),
        },
      }),
    }),
  ],
  exports: [HttpModule],
})
export class MediamtxHttpModule {}
