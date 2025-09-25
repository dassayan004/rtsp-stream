import { Module } from '@nestjs/common';

import { ConfigModule } from './common/config/config.module';
import { StreamingModule } from './streaming/streaming.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ConfigModule, StreamingModule, ScheduleModule.forRoot()],
  controllers: [],
  providers: [],
})
export class AppModule {}
