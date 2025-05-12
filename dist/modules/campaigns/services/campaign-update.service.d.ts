import { PrismaService } from '../../../prisma/prisma.service';
import { CampaignDto } from '../dto/campaign.dto';
import { CampaignValidationService } from './campaign-validation.service';
import { Prisma } from '@prisma/client';
import { FilesService } from '../../files/files.service';
export declare class CampaignUpdateService {
    private readonly prisma;
    private readonly validationService;
    private readonly filesService;
    constructor(prisma: PrismaService, validationService: CampaignValidationService, filesService: FilesService);
    update(id: string, mechanicId: string, updateCampaignDto: CampaignDto, userId: string): Promise<{
        id: string;
        mechanic_id: string;
        title: string;
        description: string;
        discount_rate: Prisma.Decimal;
        valid_until: Date;
        created_at: Date;
        categories: {
            id: string;
            name: string;
        }[];
        brands: {
            id: string;
            name: string;
        }[];
    }>;
    updateImage(id: string, mechanicId: string, file: Express.Multer.File, userId: string): Promise<{
        id: string;
        mechanic_id: string;
        title: string;
        description: string;
        discount_rate: Prisma.Decimal;
        valid_until: Date;
        created_at: Date;
        image_url: string;
        categories: {
            id: string;
            name: string;
        }[];
        brands: {
            id: string;
            name: string;
        }[];
    }>;
    private handleErrors;
}
