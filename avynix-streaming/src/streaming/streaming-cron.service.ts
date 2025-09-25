import { Injectable, Logger } from '@nestjs/common';
import { StreamingService } from './streaming.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class StreamingCronService {
  private readonly logger = new Logger(StreamingCronService.name);

  constructor(private readonly streamingService: StreamingService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async checkInactiveStreams() {
    try {
      const activeStreams = await this.streamingService.listActivePaths();
      if (!activeStreams.items || activeStreams.items.length === 0) return;
      for (const stream of activeStreams.items) {
        if (!stream.ready) {
          this.logger.warn(
            `Stream ${stream.name} is not ready. Deleting path...`,
          );
          try {
            await this.streamingService.stopStream(stream.name);
            this.logger.log(`Stream ${stream.name} deleted successfully.`);
          } catch (err) {
            this.logger.error(
              `Failed to delete stream ${stream.name}: ${(err as Error).message}`,
            );
          }
        }
      }
    } catch (error) {
      this.logger.error(
        `Error fetching active streams: ${(error as Error).message}`,
      );
    }
  }
}
