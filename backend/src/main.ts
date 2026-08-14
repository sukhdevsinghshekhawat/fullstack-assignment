import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Parse HTTP-only session cookies.
  app.use(cookieParser());

  // Validate incoming DTOs globally.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // CORS: allow the Next.js frontend origin.
  // Uses an environment variable so production can be locked down
  // instead of using a wildcard.
  const frontendOrigin = process.env.FRONTEND_URL ?? 'http://localhost:3000';
  app.enableCors({
    origin: frontendOrigin,
    credentials: true,
  });

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
}
bootstrap();