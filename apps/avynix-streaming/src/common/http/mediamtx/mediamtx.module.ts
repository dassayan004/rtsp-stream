import { Module } from '@nestjs/common';
import { MediamtxService } from './mediamtx.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ConfigSchema } from '@/common/config/schema';

@Module({
  imports: [
    HttpModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<ConfigSchema, true>) => ({
        baseURL: configService.get<string>('MEDIAMTX_CONTROL_BASE') + '/v3',
        timeout: 10000,
        auth: {
          username: configService.get<string>('MEDIAMTX_USER', 'admin'),
          password: configService.get<string>('MEDIAMTX_PASS', 'admin'),
        },
      }),
    }),
  ],
  providers: [MediamtxService],
  exports: [MediamtxService],
})
export class MediamtxModule {}
