import { Module } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { ConfigService } from '@nestjs/config';
import { ConfigSchema } from '@/common/config/schema';
import * as admin from 'firebase-admin';
import { firebaseServiceAccount } from '@/common/utils/firebase-service-account';
import { FIREBASE_DB } from '@/common/utils/constant';

const firebaseProvider = {
  provide: FIREBASE_DB,
  inject: [ConfigService],
  useFactory: (configService: ConfigService<ConfigSchema, true>) => {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(firebaseServiceAccount),
        databaseURL: configService.get<string>('FIREBASE_DATABASE_URL'),
      });
    }
    return admin.database();
  },
};
@Module({
  providers: [firebaseProvider, FirebaseService],
  exports: [FirebaseService],
})
export class FirebaseModule {}
