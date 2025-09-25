import { Module } from '@nestjs/common';

import { ConfigModule } from './common/config/config.module';
import { StreamingModule } from './streaming/streaming.module';
import { ScheduleModule } from '@nestjs/schedule';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule,
    HealthModule,
    StreamingModule,
    ScheduleModule.forRoot(),
  ],
})
export class AppModule {}
