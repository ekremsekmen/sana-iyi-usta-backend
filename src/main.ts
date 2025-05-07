import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as figlet from 'figlet';
import gradient from 'gradient-string';
import ora from 'ora';
import cliCursor from 'cli-cursor';

async function bootstrap() {

  const spinner = ora('Sana İyi Usta başlatılıyor...').start();
  spinner.color = 'green';
  
  const app = await NestFactory.create(AppModule);

  spinner.succeed('Sistem başarıyla başlatıldı!');
  
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

  console.clear();
  
  cliCursor.hide();
  
  console.log('\n');
  
  console.log(
    gradient(['#FF8C00', '#FF4500']).multiline(
      figlet.textSync('SANA IYI USTA API', {
        font: 'Straight',
        horizontalLayout: 'default',
        verticalLayout: 'default',
      })
    )
  );
  
  console.log('\n');
  
  const url = await app.getUrl();
  
  const formatLine = (content: string, width = 40) => {
    const truncatedContent = content.length > width ? content.slice(0, width - 3) + '...' : content;
    return truncatedContent.padEnd(width);
  };
  
console.log(gradient(['#FF8C00', '#FF4500'])('┌────────────────── SİSTEM ──────────────────┐'));
console.log(gradient(['#FF8C00', '#FF4500'])(`│ [•] Port    : ${formatLine(port.toString(), 28)} │`));
console.log(gradient(['#FF8C00', '#FF4500'])(`│ [•] API URL : ${formatLine(url, 28)} │`));
console.log(gradient(['#FF8C00', '#FF4500'])(`│ [•] Sistem  : ${formatLine(process.platform, 28)} │`));
console.log(gradient(['#FF8C00', '#FF4500'])('└────────────────────────────────────────────┘'));

cliCursor.show();
}

bootstrap();