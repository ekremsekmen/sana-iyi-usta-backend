import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Validation pipe'ı güncelliyoruz
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO'da tanımlanmayan özellikleri kaldırır
      forbidNonWhitelisted: true, // DTO'da tanımlanmayan alanlar gelirse hata döndürür
      transform: true, // DTO'ya dönüştürme özelliği
    }),
  );
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
