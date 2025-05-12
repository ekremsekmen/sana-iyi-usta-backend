import { PrismaService } from '../../../prisma/prisma.service';
export declare class CampaignValidationService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    validateMechanicOwnership(mechanicId: string, userId: string): Promise<void>;
    validateCampaignOwnership(campaignId: string, mechanicId: string): Promise<{
        id: string;
        created_at: Date;
        mechanic_id: string;
        description: string | null;
        title: string;
        image_url: string | null;
        discount_rate: import(".prisma/client/runtime/library").Decimal;
        valid_until: Date;
    }>;
    validateBrands(mechanicId: string, brandIds: string[]): Promise<void>;
    validateCategories(mechanicId: string, categoryIds: string[]): Promise<boolean>;
    validateDate(dateString: string): Date;
}
