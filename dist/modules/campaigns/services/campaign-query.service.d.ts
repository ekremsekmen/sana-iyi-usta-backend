import { PrismaService } from '../../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CampaignValidationService } from './campaign-validation.service';
export declare class CampaignQueryService {
    private readonly prisma;
    private readonly validationService;
    constructor(prisma: PrismaService, validationService: CampaignValidationService);
    findByMechanic(mechanicId: string, userId: string): Promise<{
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
    }[]>;
    findCampaignsForCustomer(userId: string): Promise<{
        id: string;
        mechanic_id: string;
        mechanic_name: string;
        mechanic_image: string;
        title: string;
        discount_rate: Prisma.Decimal;
        valid_until: Date;
        image_url: string;
        categories: {
            id: string;
            name: string;
        }[];
    }[]>;
    findCampaignDetails(campaignId: string): Promise<{
        id: string;
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
        mechanic: {
            id: string;
            business_name: string;
            average_rating: number;
            total_reviews: number;
            profile_image: string;
            full_name: string;
            locations: {
                id: string;
                address: string;
                city: string;
                district: string;
                latitude: Prisma.Decimal;
                longitude: Prisma.Decimal;
            }[];
        };
    }>;
    private handleErrors;
}
