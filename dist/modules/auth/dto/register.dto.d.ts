export declare enum UserRole {
    CUSTOMER = "customer",
    MECHANIC = "mechanic",
    ADMIN = "admin"
}
export declare enum AuthProvider {
    LOCAL = "local",
    GOOGLE = "google",
    FACEBOOK = "facebook",
    ICLOUD = "icloud"
}
export declare class RegisterDto {
    full_name: string;
    e_mail: string;
    password?: string;
    role: UserRole;
    kvkk_approved: boolean;
    terms_approved: boolean;
    auth_provider: AuthProvider;
    provider_id: string;
}
