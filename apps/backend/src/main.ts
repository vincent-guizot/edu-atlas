import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Client } from 'pg';
import { AppModule } from './app.module';
import { ResponseTransformInterceptor } from './common/response.interceptor';

async function ensureDatabaseExists() {
  const host = process.env.DB_HOST || '127.0.0.1';
  const port = parseInt(process.env.DB_PORT || '5432', 10);
  const user = process.env.DB_USER || 'postgres';
  const password = process.env.DB_PASS || 'admin';
  const dbName = process.env.DB_NAME || 'eduatlas_db';

  try {
    const client = new Client({
      host,
      port,
      user,
      password,
      database: 'postgres',
    });
    await client.connect();
    const res = await client.query('SELECT 1 FROM pg_database WHERE datname = $1', [dbName]);
    if (!res.rowCount || res.rowCount === 0) {
      const safeDb = dbName.replace(/[^a-zA-Z0-9_]/g, '');
      await client.query(`CREATE DATABASE "${safeDb}"`);
      Logger.log(`Database "${safeDb}" auto-created on ${host}:${port}`, 'DatabaseBootstrap');
    }
    await client.end();
  } catch (err: any) {
    Logger.warn(`Auto-create database check: ${err.message}`, 'DatabaseBootstrap');
  }
}

async function bootstrap() {
  await ensureDatabaseExists();
  const logger = new Logger('EduAtlasBootstrap');
  const app = await NestFactory.create(AppModule);

  const port = process.env.PORT || 4000;
  const apiPrefix = process.env.API_PREFIX || '/api/v1';

  // Global prefix
  app.setGlobalPrefix(apiPrefix.replace(/^\//, ''));

  // CORS
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Global Interceptor & Validation Pipe
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.useGlobalInterceptors(new ResponseTransformInterceptor());

  // Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('EduAtlas API')
    .setDescription(
      'Education Intelligence and Data Visualization Platform API contracts. Provides snapshot data for Indonesian educational institutions, geography, performance indicators, and calendar.',
    )
    .setVersion('1.0.0')
    .addTag('Snapshots')
    .addTag('Overview')
    .addTag('Schools')
    .addTag('Universities')
    .addTag('Students')
    .addTag('Teachers')
    .addTag('Geography')
    .addTag('Analytics')
    .addTag('Calendar')
    .addTag('Reports')
    .addTag('Health')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(port);
  logger.log(`EduAtlas Backend running on: http://localhost:${port}/${apiPrefix.replace(/^\//, '')}`);
  logger.log(`Swagger documentation available at: http://localhost:${port}/api/docs`);
}
bootstrap();
