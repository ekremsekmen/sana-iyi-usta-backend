import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { GetAvailableSlotsDto } from './dto/get-available-slots.dto';
import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';
export declare class AppointmentsController {
    private readonly appointmentsService;
    constructor(appointmentsService: AppointmentsService);
    createAppointment(req: RequestWithUser, dto: CreateAppointmentDto): Promise<{
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
    getAvailableSlots(dto: GetAvailableSlotsDto): Promise<any[]>;
    getMyAppointments(req: RequestWithUser): Promise<({
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
    getMechanicAppointments(req: RequestWithUser): Promise<({
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
    cancelAppointment(req: RequestWithUser, id: string): Promise<{
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
    approveAppointment(req: RequestWithUser, id: string): Promise<{
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
    completeAppointment(req: RequestWithUser, id: string): Promise<{
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
    getAppointmentById(req: RequestWithUser, id: string): Promise<{
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
