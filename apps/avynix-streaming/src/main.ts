import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigSchema } from './common/config/schema';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService<ConfigSchema, true>);

  const port = configService.getOrThrow<number>('PORT');
  const baseUrl = configService.getOrThrow<string>('BASE_URL');
  const env = configService.getOrThrow<string>('NODE_ENV');

  // swagger openapi
  const swaggerPrefix = 'swagger';
  const config = new DocumentBuilder()
    .setTitle('Streaming Api')
    .setDescription('The Streaming API description')
    .setVersion(env.toUpperCase())
    .addServer(baseUrl)
    .addBearerAuth()
    .setExternalDoc('Postman Collection', `${swaggerPrefix}/json`)
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(swaggerPrefix, app, document, {
    jsonDocumentUrl: `${swaggerPrefix}/json`,
  });

  // Middleware
  app.enableCors({
    origin: ['http://localhost:3000'],
  });
  app.enableShutdownHooks();

  // Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(port);
  Logger.log(`🚀 Application is running on: ${baseUrl}`);
  Logger.log(`🌎 Swagger is running on: ${baseUrl}/${swaggerPrefix}`);
}
bootstrap();
