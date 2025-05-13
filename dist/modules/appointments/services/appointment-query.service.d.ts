import { PrismaService } from '../../../prisma/prisma.service';
export declare class AppointmentQueryService {
    private prisma;
    constructor(prisma: PrismaService);
    getCustomerAppointments(customerId: string): Promise<({
        customer_vehicles: {
            brands: {
                id: string;
                name: string;
            };
            models: {
                id: string;
                name: string;
                brand_id: string;
            };
        } & {
            id: string;
            created_at: Date;
            brand_id: string;
            customer_id: string;
            model_id: string;
            model_year_id: string;
            variant_id: string;
            plate_number: string | null;
            photo_url: string | null;
        };
        mechanics: {
            users: {
                full_name: string;
                e_mail: string;
                role: string;
                id: string;
                created_at: Date;
                phone_number: string | null;
                profile_image: string | null;
                default_location_id: string | null;
            };
        } & {
            id: string;
            user_id: string;
            created_at: Date;
            business_name: string;
            on_site_service: boolean | null;
            average_rating: number | null;
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
        };
    } & {
        id: string;
        created_at: Date;
        status: string;
        mechanic_id: string;
        start_time: Date;
        end_time: Date;
        vehicle_id: string;
        customer_id: string;
        appointment_date: Date;
        description: string | null;
        appointment_type: import(".prisma/client").$Enums.AppointmentType;
        location_id: string | null;
    })[]>;
    getMechanicAppointments(mechanicId: string): Promise<({
        customer_vehicles: {
            brands: {
                id: string;
                name: string;
            };
            models: {
                id: string;
                name: string;
                brand_id: string;
            };
        } & {
            id: string;
            created_at: Date;
            brand_id: string;
            customer_id: string;
            model_id: string;
            model_year_id: string;
            variant_id: string;
            plate_number: string | null;
            photo_url: string | null;
        };
        customers: {
            users: {
                full_name: string;
                e_mail: string;
                role: string;
                id: string;
                created_at: Date;
                phone_number: string | null;
                profile_image: string | null;
                default_location_id: string | null;
            };
        } & {
            id: string;
            user_id: string;
            created_at: Date | null;
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
        };
    } & {
        id: string;
        created_at: Date;
        status: string;
        mechanic_id: string;
        start_time: Date;
        end_time: Date;
        vehicle_id: string;
        customer_id: string;
        appointment_date: Date;
        description: string | null;
        appointment_type: import(".prisma/client").$Enums.AppointmentType;
        location_id: string | null;
    })[]>;
    getAppointmentById(appointmentId: string, userId: string, userRole: string): Promise<{
        customer_vehicles: {
            brands: {
                id: string;
                name: string;
            };
            model_years: {
                id: string;
                model_id: string;
                year: number;
            };
            models: {
                id: string;
                name: string;
                brand_id: string;
            };
            variants: {
                id: string;
                name: string;
                model_year_id: string;
            };
        } & {
            id: string;
            created_at: Date;
            brand_id: string;
            customer_id: string;
            model_id: string;
            model_year_id: string;
            variant_id: string;
            plate_number: string | null;
            photo_url: string | null;
        };
        customers: {
            users: {
                full_name: string;
                id: string;
                phone_number: string;
                profile_image: string;
            };
        } & {
            id: string;
            user_id: string;
            created_at: Date | null;
        };
        mechanics: {
            users: {
                full_name: string;
                id: string;
                phone_number: string;
                profile_image: string;
            };
        } & {
            id: string;
            user_id: string;
            created_at: Date;
            business_name: string;
            on_site_service: boolean | null;
            average_rating: number | null;
        };
        ratings_reviews: {
            id: string;
            created_at: Date;
            mechanic_id: string;
            rating: number;
            appointment_id: string | null;
            customer_id: string;
            review: string | null;
            mechanic_response: string | null;
        };
        vehicle_maintenance_records: {
            id: string;
            created_at: Date | null;
            mechanic_id: string;
            appointment_id: string | null;
            details: string;
            cost: import(".prisma/client/runtime/library").Decimal;
            odometer: number;
            next_due_date: Date | null;
            vehicle_id: string;
            service_date: Date | null;
            customer_id: string | null;
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
        };
    } & {
        id: string;
        created_at: Date;
        status: string;
        mechanic_id: string;
        start_time: Date;
        end_time: Date;
        vehicle_id: string;
        customer_id: string;
        appointment_date: Date;
        description: string | null;
        appointment_type: import(".prisma/client").$Enums.AppointmentType;
        location_id: string | null;
    }>;
}
