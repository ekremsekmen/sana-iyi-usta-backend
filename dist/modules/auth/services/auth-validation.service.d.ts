import { PrismaService } from '../../../prisma/prisma.service';
import { RegisterDto } from '../dto/register.dto';
export declare class AuthValidationService {
    private prisma;
    constructor(prisma: PrismaService);
    findExistingAuth(provider: string, providerId: string): Promise<{
        users: {
            full_name: string;
            e_mail: string;
            role: string;
            id: string;
            phone_number: string | null;
            profile_image: string | null;
            created_at: Date;
            default_location_id: string | null;
        };
    } & {
        kvkk_approved: boolean;
        terms_approved: boolean;
        auth_provider: string;
        provider_id: string | null;
        id: string;
        user_id: string;
        password_hash: string | null;
        is_phone_verified: boolean;
        is_banned: boolean;
        cookies: boolean;
        e_mail_verified: boolean;
    }>;
    validateRegistration(registerDto: RegisterDto): Promise<void>;
    validateUserRole(existingRole: string, newRole: string): Promise<void>;
}
