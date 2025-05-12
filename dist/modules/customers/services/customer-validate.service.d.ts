import { PrismaService } from '../../../prisma/prisma.service';
export declare class CustomerValidateService {
    private prisma;
    constructor(prisma: PrismaService);
    findCustomerByUserId(userId: string): Promise<{
        id: string;
        user_id: string;
        created_at: Date | null;
    }>;
    verifyVehicleOwnership(customerId: string, vehicleId: string): Promise<{
        id: string;
        created_at: Date;
        brand_id: string;
        customer_id: string;
        model_id: string;
        model_year_id: string;
        variant_id: string;
        plate_number: string | null;
        photo_url: string | null;
    }>;
}
