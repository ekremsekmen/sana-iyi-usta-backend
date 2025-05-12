import { PrismaService } from '../../../prisma/prisma.service';
import { MechanicProfileDto } from '../dto/mechanic-profile.dto';
export declare class MechanicProfileService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(userId: string, dto: MechanicProfileDto): Promise<{
        id: string;
        user_id: string;
        created_at: Date;
        business_name: string;
        on_site_service: boolean | null;
        average_rating: number | null;
    }>;
    findOne(id: string): Promise<{
        id: string;
        user_id: string;
        created_at: Date;
        business_name: string;
        on_site_service: boolean | null;
        average_rating: number | null;
    }>;
    update(id: string, userId: string, dto: MechanicProfileDto): Promise<{
        id: string;
        user_id: string;
        created_at: Date;
        business_name: string;
        on_site_service: boolean | null;
        average_rating: number | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        user_id: string;
        created_at: Date;
        business_name: string;
        on_site_service: boolean | null;
        average_rating: number | null;
    }>;
    findByUserId(userId: string): Promise<{
        hasMechanicProfile: boolean;
        profile: {
            id: string;
            user_id: string;
            created_at: Date;
            business_name: string;
            on_site_service: boolean | null;
            average_rating: number | null;
        };
    }>;
}
