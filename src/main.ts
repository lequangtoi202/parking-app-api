import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { swaggerConfig } from './config/swagger.config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  useContainer(app.select(AppModule), {
    fallbackOnErrors: true,
  });

  app.enableCors({
    origin: '*',
    methods: ['GET', 'PUT', 'PATCH', 'POST', 'DELETE'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
  swaggerConfig(app);

  await app.listen(process.env.PORT ?? 3000);
  Logger.log(`Server is listening on ${await app.getUrl()}`, 'Bootstrap');
}

bootstrap();
