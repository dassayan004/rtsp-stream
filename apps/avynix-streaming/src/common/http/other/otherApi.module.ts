// import { Module } from '@nestjs/common';
// import { OtherApiService } from './otherApi.service';
// import { HttpModule } from '@nestjs/axios';
// import { ConfigService } from '@nestjs/config';
// import { ConfigSchema } from '@/common/config/schema';

// @Module({
//   imports: [
//     HttpModule.registerAsync({
//       inject: [ConfigService],
//       useFactory: (configService: ConfigService<ConfigSchema, true>) => ({
//         baseURL: 'https://dummyjson.com',
//       }),
//     }),
//   ],
//   providers: [OtherApiService],
//   exports: [OtherApiService],
// })
// export class OtherApiHttpModule {}
