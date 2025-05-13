import { PrismaService } from '../../../prisma/prisma.service';
import { GoogleAuthDto, AppleAuthDto, FacebookAuthDto } from '../dto/social-auth.dto';
export interface SocialUserInfo {
    e_mail: string;
    full_name: string;
    provider_id: string;
    role: string;
    kvkk_approved: boolean;
    terms_approved: boolean;
}
export declare class SocialAuthenticationService {
    private prisma;
    constructor(prisma: PrismaService);
    authenticateWithGoogle(googleAuthDto: GoogleAuthDto): Promise<{
        user_auth: {
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
        }[];
    } & {
        full_name: string;
        e_mail: string;
        role: string;
        id: string;
        created_at: Date;
        phone_number: string | null;
        profile_image: string | null;
        default_location_id: string | null;
    }>;
    authenticateWithApple(appleAuthDto: AppleAuthDto): Promise<{
        user_auth: {
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
        }[];
    } & {
        full_name: string;
        e_mail: string;
        role: string;
        id: string;
        created_at: Date;
        phone_number: string | null;
        profile_image: string | null;
        default_location_id: string | null;
    }>;
    authenticateWithFacebook(facebookAuthDto: FacebookAuthDto): Promise<{
        user_auth: {
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
        }[];
    } & {
        full_name: string;
        e_mail: string;
        role: string;
        id: string;
        created_at: Date;
        phone_number: string | null;
        profile_image: string | null;
        default_location_id: string | null;
    }>;
    handleSocialUser(userInfo: any, provider: string): Promise<{
        user_auth: {
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
        }[];
    } & {
        full_name: string;
        e_mail: string;
        role: string;
        id: string;
        created_at: Date;
        phone_number: string | null;
        profile_image: string | null;
        default_location_id: string | null;
    }>;
    findOrCreateSocialUser(userInfo: SocialUserInfo, provider: string): Promise<{
        user_auth: {
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
        }[];
    } & {
        full_name: string;
        e_mail: string;
        role: string;
        id: string;
        created_at: Date;
        phone_number: string | null;
        profile_image: string | null;
        default_location_id: string | null;
    }>;
    private mapToSocialUserInfo;
}
