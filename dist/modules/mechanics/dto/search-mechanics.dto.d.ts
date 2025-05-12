export declare enum SortOrder {
    ASC = "asc",
    DESC = "desc"
}
export declare enum SortBy {
    RATING = "rating",
    DISTANCE = "distance"
}
export declare class SearchMechanicsDto {
    city: string;
    brandId: string;
    categoryId: string;
    onSiteService?: boolean;
    page?: number;
    limit?: number;
    ratingSort?: SortOrder;
    sortBy?: SortBy;
}
export declare class MechanicSearchResponseDto {
    id: string;
    business_name: string;
    on_site_service: boolean;
    average_rating: number;
    user_id: string;
    user?: {
        full_name: string;
        profile_image?: string;
    };
    distance?: number;
    categories?: {
        id: string;
        name: string;
    }[];
    supported_vehicles?: {
        id: string;
        name: string;
    }[];
    total_reviews?: number;
}
