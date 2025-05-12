export declare class UpdateUserDto {
    phone_number?: string;
    profile_image?: string;
    full_name?: string;
    role?: string;
}
export interface BasicUserInfo {
    id: string;
    phone_number?: string;
    profile_image?: string;
    full_name?: string;
    role?: string;
    email?: string;
}
export interface BasicMechanicInfo {
    id: string;
    business_name: string;
    on_site_service?: boolean;
    average_rating?: number;
}
export interface BasicCustomerInfo {
    id: string;
}
export interface UserProfileResponseDto {
    user: BasicUserInfo;
    mechanic?: BasicMechanicInfo;
    customer?: BasicCustomerInfo;
}
export interface DefaultLocationResponseDto {
    id: string;
    default_location: any | null;
}
