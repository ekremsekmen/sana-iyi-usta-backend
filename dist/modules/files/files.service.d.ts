import { ConfigService } from '@nestjs/config';
export declare class FilesService {
    private configService;
    private s3Client;
    constructor(configService: ConfigService);
    uploadFile(file: Express.Multer.File, folder: string): Promise<string>;
}
