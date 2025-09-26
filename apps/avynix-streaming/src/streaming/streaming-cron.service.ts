import { Injectable, Logger } from '@nestjs/common';
import { StreamingService } from './streaming.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { FirebaseService } from '@/firebase/firebase.service';
import { Protocol } from '@/common/enum/protocol.enum';

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
      const [activeStreams, cameras] = await Promise.all([
        this.streamingService.listActivePaths(),
        this.firebaseService.getCameras(),
      ]);
      if (!activeStreams.items?.length) return;

      const activeStreamIds = new Set(activeStreams.items.map((s) => s.name));

      const inactiveCameras = cameras.filter(
        (cam) => cam.isActive && !cam.isStreaming,
        // && cam.users.length === 0,
      );
      for (const camera of inactiveCameras) {
        const streams = [
          { id: camera.stream_id_hls, protocol: Protocol.HLS },
          { id: camera.stream_id_webrtc, protocol: Protocol.WEBRTC },
        ];

        for (const stream of streams) {
          if (!stream.id || !activeStreamIds.has(stream.id)) continue;

          switch (stream.protocol) {
            case Protocol.HLS:
              try {
                await this.streamingService.stopStream(stream.id);
                this.logger.log(
                  `Stopped HLS stream ${stream.id} for inactive camera ${camera.id}`,
                );
              } catch (err) {
                this.logger.error(
                  `Failed to stop HLS stream ${stream.id}: ${(err as Error).message}`,
                );
              }
              break;

            case Protocol.WEBRTC:
              try {
                await this.streamingService.stopStream(stream.id);
                this.logger.log(
                  `Stopped WebRTC stream ${stream.id} for inactive camera ${camera.id}`,
                );
              } catch (err) {
                this.logger.error(
                  `Failed to stop WebRTC stream ${stream.id}: ${(err as Error).message}`,
                );
              }
              break;

            default:
              this.logger.warn(
                `Unknown protocol ${stream.protocol} for camera ${camera.id}`,
              );
          }
        }
      }
    } catch (err) {
      this.logger.error(
        `Failed to check inactive streams: ${(err as Error).message}`,
      );
    }
  }
}
