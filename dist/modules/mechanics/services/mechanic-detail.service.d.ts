import { PrismaService } from '../../../prisma/prisma.service';
export declare class MechanicDetailService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getMechanicDetailByUserId(userId: string): Promise<{
        user: {
            id: string;
            full_name: string;
            phone_number: string;
            profile_image: string;
            email: string;
            default_location: {
                id: string;
                user_id: string;
                created_at: Date | null;
                address: string;
                latitude: import(".prisma/client/runtime/library").Decimal | null;
                longitude: import(".prisma/client/runtime/library").Decimal | null;
                label: string | null;
                city: string | null;
                district: string | null;
            };
            locations: {
                id: string;
                user_id: string;
                created_at: Date | null;
                address: string;
                latitude: import(".prisma/client/runtime/library").Decimal | null;
                longitude: import(".prisma/client/runtime/library").Decimal | null;
                label: string | null;
                city: string | null;
                district: string | null;
            }[];
        };
        mechanic: {
            id: string;
            business_name: string;
            on_site_service: boolean;
            average_rating: number;
            created_at: Date;
        };
        working_hours: {
            id: string;
            mechanic_id: string;
            day_of_week: number;
            start_time: string;
            end_time: string;
            slot_duration: number;
            is_day_off: boolean;
        }[];
        supported_vehicles: {
            id: string;
            brand: {
                id: string;
                name: string;
            };
        }[];
        categories: {
            id: string;
            category: {
                id: string;
                name: string;
                created_at: Date | null;
                parent_id: string | null;
            };
        }[];
        ratings: {
            id: string;
            rating: number;
            review: string;
            mechanic_response: string;
            created_at: Date;
            customer: {
                id: string;
                full_name: string;
                profile_image: string;
            };
        }[];
    }>;
    getMechanicDetailById(mechanicId: string): Promise<{
        user: {
            id: string;
            full_name: string;
            phone_number: string;
            profile_image: string;
            email: string;
            default_location: {
                id: string;
                user_id: string;
                created_at: Date | null;
                address: string;
                latitude: import(".prisma/client/runtime/library").Decimal | null;
                longitude: import(".prisma/client/runtime/library").Decimal | null;
                label: string | null;
                city: string | null;
                district: string | null;
            };
            locations: {
                id: string;
                user_id: string;
                created_at: Date | null;
                address: string;
                latitude: import(".prisma/client/runtime/library").Decimal | null;
                longitude: import(".prisma/client/runtime/library").Decimal | null;
                label: string | null;
                city: string | null;
                district: string | null;
            }[];
        };
        mechanic: {
            id: string;
            business_name: string;
            on_site_service: boolean;
            average_rating: number;
            created_at: Date;
        };
        working_hours: {
            id: string;
            mechanic_id: string;
            day_of_week: number;
            start_time: string;
            end_time: string;
            slot_duration: number;
            is_day_off: boolean;
        }[];
        supported_vehicles: {
            id: string;
            brand: {
                id: string;
                name: string;
            };
        }[];
        categories: {
            id: string;
            category: {
                id: string;
                name: string;
                created_at: Date | null;
                parent_id: string | null;
            };
        }[];
        ratings: {
            id: string;
            rating: number;
            review: string;
            mechanic_response: string;
            created_at: Date;
            customer: {
                id: string;
                full_name: string;
                profile_image: string;
            };
        }[];
    }>;
}
