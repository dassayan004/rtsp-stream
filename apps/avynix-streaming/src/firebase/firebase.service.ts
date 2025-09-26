import { CameraDevice } from '@/common/types';
import { FIREBASE_DB } from '@/common/utils/constant';

import { Inject, Injectable, Logger } from '@nestjs/common';
import type { Database } from 'firebase-admin/database';

@Injectable()
export class FirebaseService {
  private readonly logger = new Logger(FirebaseService.name);

  constructor(@Inject(FIREBASE_DB) private readonly db: Database) {}
  async getCameras(): Promise<CameraDevice[]> {
    try {
      const snapshot = await this.db.ref('/camera_devices').get();
      const data = snapshot.exists() ? snapshot.val() : {};

      const cameras: CameraDevice[] = Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      }));

      return cameras;
    } catch (error) {
      this.logger.error('Failed to fetch cameras', error);
      throw error;
    }
  }
}
