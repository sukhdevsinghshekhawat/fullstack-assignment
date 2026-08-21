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

  // CORS: allow a list of trusted frontend origins (comma-separated).
  // Example: FRONTEND_URLS="http://localhost:3000,https://tasksassigns.netlify.app"
  const frontendUrls = (process.env.FRONTEND_URLS ?? 'http://localhost:3000').split(',').map(s => s.trim()).filter(Boolean);

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., curl, server-to-server).
      if (!origin) return callback(null, true);
      if (frontendUrls.includes(origin)) return callback(null, true);
      return callback(new Error('CORS origin not allowed'), false);
    },
    credentials: true,
  });

  const port = process.env.PORT ?? 3001;
   await app.listen(port, '0.0.0.0');
}
bootstrap();