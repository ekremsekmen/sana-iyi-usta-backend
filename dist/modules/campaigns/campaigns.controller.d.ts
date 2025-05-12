import { CampaignsService } from './campaigns.service';
import { CampaignDto } from './dto/campaign.dto';
import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';
export declare class CampaignsController {
    private readonly campaignsService;
    constructor(campaignsService: CampaignsService);
    findByMechanic(request: RequestWithUser): Promise<{
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
    create(createCampaignDto: CampaignDto, request: RequestWithUser): Promise<{
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
    update(id: string, updateCampaignDto: CampaignDto, request: RequestWithUser): Promise<{
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
    remove(id: string, request: RequestWithUser): Promise<{
        message: string;
    }>;
    findCampaignsForCustomer(request: RequestWithUser): Promise<{
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
    findCampaignDetails(id: string): Promise<{
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
    uploadImage(id: string, file: Express.Multer.File, request: RequestWithUser): Promise<{
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
