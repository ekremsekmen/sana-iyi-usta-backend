
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  console.log('Sana İyi Usta başlatılıyor...');
  
  const app = await NestFactory.create(AppModule);

  console.log('Sistem başarıyla başlatıldı!');
  
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  
  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 3000;
  
  await app.listen(port);


  console.log('\n===========================================');
  console.log('          SANA IYI USTA API                ');
  console.log('===========================================');
  
  const url = await app.getUrl();
  console.log(`API URL   : ${url}`);
  console.log(`Port      : ${port}`);
  console.log(`Sistem    : ${process.platform}`);
  console.log('===========================================\n');
}

bootstrap();