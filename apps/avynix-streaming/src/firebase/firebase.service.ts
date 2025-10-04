import { CameraDevice, FirebaseCameraDevice } from '@/common/types';
import { FIREBASE_DB } from '@/common/utils/constant';

import { Inject, Injectable, Logger } from '@nestjs/common';
import type { Database } from 'firebase-admin/database';

@Injectable()
export class FirebaseService {
  private readonly logger = new Logger(FirebaseService.name);

  constructor(@Inject(FIREBASE_DB) private readonly db: Database) {}
  private mapFirebaseCamera(
    cam: FirebaseCameraDevice,
    id: string,
  ): CameraDevice {
    return {
      id,
      name: cam.name,
      rtsp_url: cam.rtsp_url,
      isActive: cam.isActive,
      isStreaming: cam.isStreaming,
      users: cam.users ? Object.keys(cam.users) : [],
      stream_id_hls: cam.stream_id_hls,
      stream_id_webrtc: cam.stream_id_webrtc,
      hls_url: cam.hls_url,
      webrtc_url: cam.webrtc_url,
    };
  }
  async getCameras(): Promise<CameraDevice[]> {
    try {
      const snapshot = await this.db.ref('/camera_devices').get();
      const data = snapshot.exists() ? snapshot.val() : {};

      return Object.keys(data).map((key) =>
        this.mapFirebaseCamera(data[key], key),
      );
    } catch (error) {
      this.logger.error('Failed to fetch cameras', error);
      throw error;
    }
  }
}
