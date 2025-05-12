import { PrismaService } from '../../../prisma/prisma.service';
import { CampaignValidationService } from './campaign-validation.service';
export declare class CampaignDeleteService {
    private readonly prisma;
    private readonly validationService;
    constructor(prisma: PrismaService, validationService: CampaignValidationService);
    remove(id: string, mechanicId: string, userId: string): Promise<{
        message: string;
    }>;
    private handleErrors;
}
