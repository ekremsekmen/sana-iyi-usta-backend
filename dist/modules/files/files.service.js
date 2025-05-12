"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilesService = void 0;
const common_1 = require("@nestjs/common");
const client_s3_1 = require("@aws-sdk/client-s3");
const config_1 = require("@nestjs/config");
let FilesService = class FilesService {
    constructor(configService) {
        this.configService = configService;
        this.s3Client = new client_s3_1.S3Client({
            region: this.configService.get('AWS_REGION'),
            credentials: {
                accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
                secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
            },
        });
    }
    async uploadFile(file, folder) {
        const fileName = `${folder}/${Date.now()}-${file.originalname.replace(/\s/g, '')}`;
        const command = new client_s3_1.PutObjectCommand({
            Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
            Key: fileName,
            Body: file.buffer,
            ContentType: file.mimetype,
        });
        await this.s3Client.send(command);
        return `https://${this.configService.get('AWS_S3_BUCKET_NAME')}.s3.${this.configService.get('AWS_REGION')}.amazonaws.com/${fileName}`;
    }
};
exports.FilesService = FilesService;
exports.FilesService = FilesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], FilesService);
//# sourceMappingURL=files.service.js.map