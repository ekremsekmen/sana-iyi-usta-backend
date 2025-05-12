import { CampaignDto } from './dto/campaign.dto';
import { CampaignCreateService } from './services/campaign-create.service';
import { CampaignQueryService } from './services/campaign-query.service';
import { CampaignUpdateService } from './services/campaign-update.service';
import { CampaignDeleteService } from './services/campaign-delete.service';
import { MechanicsService } from '../mechanics/mechanics.service';
export declare class CampaignsService {
    private readonly createService;
    private readonly queryService;
    private readonly updateService;
    private readonly deleteService;
    private readonly mechanicsService;
    constructor(createService: CampaignCreateService, queryService: CampaignQueryService, updateService: CampaignUpdateService, deleteService: CampaignDeleteService, mechanicsService: MechanicsService);
    validateAndGetMechanicProfile(userId: string): Promise<{
        id: string;
        user_id: string;
        created_at: Date;
        business_name: string;
        on_site_service: boolean | null;
        average_rating: number | null;
    }>;
    create(mechanicId: string, createCampaignDto: CampaignDto, userId: string): Promise<{
        id: string;
        mechanic_id: string;
        title: string;
        description: string;
        discount_rate: import(".prisma/client/runtime/library").Decimal;
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
    findByMechanic(mechanicId: string, userId: string): Promise<{
        id: string;
        mechanic_id: string;
        title: string;
        description: string;
        discount_rate: import(".prisma/client/runtime/library").Decimal;
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
    update(id: string, mechanicId: string, updateCampaignDto: CampaignDto, userId: string): Promise<{
        id: string;
        mechanic_id: string;
        title: string;
        description: string;
        discount_rate: import(".prisma/client/runtime/library").Decimal;
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
    remove(id: string, mechanicId: string, userId: string): Promise<{
        message: string;
    }>;
    findCampaignsForCustomer(userId: string): Promise<{
        id: string;
        mechanic_id: string;
        mechanic_name: string;
        mechanic_image: string;
        title: string;
        discount_rate: import(".prisma/client/runtime/library").Decimal;
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
        discount_rate: import(".prisma/client/runtime/library").Decimal;
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
                latitude: import(".prisma/client/runtime/library").Decimal;
                longitude: import(".prisma/client/runtime/library").Decimal;
            }[];
        };
    }>;
    updateImage(id: string, mechanicId: string, file: Express.Multer.File, userId: string): Promise<{
        id: string;
        mechanic_id: string;
        title: string;
        description: string;
        discount_rate: import(".prisma/client/runtime/library").Decimal;
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
}
