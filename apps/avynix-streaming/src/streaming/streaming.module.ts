import { Module } from '@nestjs/common';
import { StreamingService } from './streaming.service';
import { StreamingController } from './streaming.controller';

import { StreamingCronService } from './streaming-cron.service';
import { MediamtxModule } from '@/common/http/mediamtx/mediamtx.module';
import { FirebaseModule } from '@/firebase/firebase.module';

@Module({
  imports: [MediamtxModule, FirebaseModule],
  controllers: [StreamingController],
  providers: [StreamingService, StreamingCronService],
})
export class StreamingModule {}
