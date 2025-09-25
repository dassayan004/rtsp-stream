import { Injectable, Logger } from '@nestjs/common';
import { StreamingService } from './streaming.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { FirebaseService } from '@/firebase/firebase.service';

@Injectable()
export class StreamingCronService {
  private readonly logger = new Logger(StreamingCronService.name);

  constructor(
    private readonly streamingService: StreamingService,
    private readonly firebaseService: FirebaseService,
  ) {}

  @Cron(CronExpression.EVERY_30_MINUTES)
  async checkInactiveStreams() {
    try {
      const [activeStreams, firebaseState] = await Promise.all([
        this.streamingService.listActivePaths(),
        this.firebaseService.getCameraState(),
      ]);

      if (!activeStreams.items || activeStreams.items.length === 0) return;

      const activeIds = activeStreams.items.map((s) => s.name);
      for (const streamId of firebaseState.inactive) {
        if (activeIds.includes(streamId)) {
          this.logger.warn(
            `Firebase marks ${streamId} inactive. Stopping in MediaMTX...`,
          );
          await this.streamingService
            .stopStream(streamId)
            .then(() => this.logger.log(`Stream ${streamId} stopped.`))
            .catch((err) =>
              this.logger.error(
                `Failed to stop ${streamId}: ${(err as Error).message}`,
              ),
            );
        }
      }
    } catch (err) {
      this.logger.error(
        `Failed to check inactive streams: ${(err as Error).message}`,
      );
    }
  }
}
