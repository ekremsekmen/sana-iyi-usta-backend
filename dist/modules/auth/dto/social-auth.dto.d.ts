import { UserRole } from './register.dto';
export declare class GoogleAuthDto {
    accessToken: string;
    providerId: string;
    email: string;
    fullName?: string;
    picture?: string;
    role?: UserRole;
    kvkkApproved?: boolean;
    termsApproved?: boolean;
}
export declare class AppleAuthDto {
    identityToken: string;
    providerId: string;
    email: string;
    fullName?: string;
    role?: UserRole;
    kvkkApproved?: boolean;
    termsApproved?: boolean;
}
export declare class FacebookAuthDto {
    accessToken: string;
    providerId: string;
    email: string;
    fullName?: string;
    picture?: string;
    role?: UserRole;
    kvkkApproved?: boolean;
    termsApproved?: boolean;
}
