"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
async function bootstrap() {
    console.log('Sana İyi Usta başlatılıyor...');
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    console.log('Sistem başarıyla başlatıldı!');
    app.enableCors({
        origin: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    const configService = app.get(config_1.ConfigService);
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
//# sourceMappingURL=main.js.map