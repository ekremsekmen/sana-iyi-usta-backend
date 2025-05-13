import { PrismaService } from '../../../prisma/prisma.service';
export declare class LocalAuthenticationService {
    private prisma;
    constructor(prisma: PrismaService);
    authenticateUser(e_mail: string, password: string): Promise<{
        full_name: string;
        e_mail: string;
        role: string;
        id: string;
        created_at: Date;
        phone_number: string | null;
        profile_image: string | null;
        default_location_id: string | null;
    }>;
}
