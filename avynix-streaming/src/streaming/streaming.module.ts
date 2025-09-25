import { Module } from '@nestjs/common';
import { StreamingService } from './streaming.service';
import { StreamingController } from './streaming.controller';

import { StreamingCronService } from './streaming-cron.service';
import { MediamtxModule } from '@/common/http/mediamtx/mediamtx.module';

@Module({
  imports: [MediamtxModule],
  controllers: [StreamingController],
  providers: [StreamingService],
})
export class StreamingModule {}
