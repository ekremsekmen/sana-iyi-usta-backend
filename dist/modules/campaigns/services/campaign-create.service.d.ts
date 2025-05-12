import { PrismaService } from '../../../prisma/prisma.service';
import { CampaignDto } from '../dto/campaign.dto';
import { CampaignValidationService } from './campaign-validation.service';
import { NotificationsService } from '../../notifications/notifications.service';
import { Prisma } from '@prisma/client';
export declare class CampaignCreateService {
    private readonly prisma;
    private readonly validationService;
    private readonly notificationsService;
    constructor(prisma: PrismaService, validationService: CampaignValidationService, notificationsService: NotificationsService);
    create(mechanicId: string, createCampaignDto: CampaignDto, userId: string): Promise<{
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
