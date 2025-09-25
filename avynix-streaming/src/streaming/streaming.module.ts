import { Module } from '@nestjs/common';
import { StreamingService } from './streaming.service';
import { StreamingController } from './streaming.controller';
import { MediamtxHttpModule } from './mediamtx-http.module';
import { StreamingCronService } from './streaming-cron.service';

@Module({
  imports: [MediamtxHttpModule],
  controllers: [StreamingController],
  providers: [StreamingService, StreamingCronService],
})
export class StreamingModule {}
