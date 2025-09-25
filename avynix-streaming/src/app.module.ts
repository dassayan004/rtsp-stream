import { Module } from '@nestjs/common';

import { ConfigModule } from './common/config/config.module';
import { StreamingModule } from './streaming/streaming.module';

@Module({
  imports: [ConfigModule, StreamingModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
