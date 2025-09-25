import { CameraState } from '@/common/types';
import { FIREBASE_DB } from '@/common/utils/constant';

import { Inject, Injectable, Logger } from '@nestjs/common';
import type { Database } from 'firebase-admin/database';

@Injectable()
export class FirebaseService {
  private readonly logger = new Logger(FirebaseService.name);

  constructor(@Inject(FIREBASE_DB) private readonly db: Database) {}

  async getCameraState(): Promise<CameraState> {
    const snapshot = await this.db.ref('/CameraState').get();
    const data = snapshot.exists() ? snapshot.val() : {};

    return {
      active: Array.isArray(data.active) ? data.active : [],
      inactive: Array.isArray(data.inactive) ? data.inactive : [],
    };
  }

  async addActiveStream(streamId: string) {
    const state = await this.getCameraState();

    if (!state.active.includes(streamId)) {
      state.active.push(streamId);
      state.inactive = state.inactive.filter((id) => id !== streamId);
      await this.db.ref('/CameraState').set(state);
      this.logger.log(`Stream ${streamId} added to active`);
    }
  }

  async moveToInactive(streamId: string) {
    const state = await this.getCameraState();

    state.active = state.active.filter((id) => id !== streamId);
    if (!state.inactive.includes(streamId)) {
      state.inactive.push(streamId);
    }
    await this.db.ref('/CameraState').set(state);
    this.logger.log(`Stream ${streamId} moved to inactive`);
  }

  async removeStream(streamId: string) {
    const state = await this.getCameraState();

    const active = state.active.filter((id) => id !== streamId);
    const inactive = state.inactive.filter((id) => id !== streamId);
    await this.db.ref('/CameraState').set({ active, inactive });
    this.logger.log(`Stream ${streamId} was removed`);
  }
}
