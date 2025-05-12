import { MechanicsService } from './mechanics.service';
import { MechanicProfileDto } from './dto/mechanic-profile.dto';
import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';
import { MechanicSupportedVehicleDto } from './dto/mechanic-supported-vehicle.dto';
import { MechanicWorkingHoursDto } from './dto/mechanic-working-hours.dto';
import { MechanicCategoryDto } from './dto/mechanic-category.dto';
import { SearchMechanicsDto } from './dto/search-mechanics.dto';
import { CreateVehicleMaintenanceRecordDto } from './dto/create-vehicle-maintenance-record.dto';
export declare class MechanicsController {
    private readonly mechanicsService;
    constructor(mechanicsService: MechanicsService);
    create(mechanicProfileDto: MechanicProfileDto, request: RequestWithUser): Promise<{
        id: string;
        user_id: string;
        created_at: Date;
        business_name: string;
        on_site_service: boolean | null;
        average_rating: number | null;
    }>;
    findOne(request: RequestWithUser): Promise<{
        id: string;
        user_id: string;
        created_at: Date;
        business_name: string;
        on_site_service: boolean | null;
        average_rating: number | null;
    }>;
    update(mechanicProfileDto: MechanicProfileDto, request: RequestWithUser): Promise<{
        id: string;
        user_id: string;
        created_at: Date;
        business_name: string;
        on_site_service: boolean | null;
        average_rating: number | null;
    }>;
    remove(request: RequestWithUser): Promise<{
        id: string;
        user_id: string;
        created_at: Date;
        business_name: string;
        on_site_service: boolean | null;
        average_rating: number | null;
    }>;
    getSupportedVehicles(request: RequestWithUser): Promise<({
        brands: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        mechanic_id: string;
        brand_id: string;
    })[]>;
    addSupportedVehicle(body: MechanicSupportedVehicleDto | MechanicSupportedVehicleDto[], request: RequestWithUser): Promise<({
        brands: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        mechanic_id: string;
        brand_id: string;
    })[] | ({
        brands: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        mechanic_id: string;
        brand_id: string;
    })>;
    removeSupportedVehicle(brandId: string, request: RequestWithUser): Promise<{
        brands: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        mechanic_id: string;
        brand_id: string;
    }>;
    updateSupportedVehicles(dto: MechanicSupportedVehicleDto[], request: RequestWithUser): Promise<({
        brands: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        mechanic_id: string;
        brand_id: string;
    })[]>;
    getWorkingHours(request: RequestWithUser): Promise<{
        id: string;
        mechanic_id: string;
        day_of_week: number;
        start_time: string;
        end_time: string;
        slot_duration: number;
        is_day_off: boolean;
    }[]>;
    createWorkingHours(mechanicWorkingHoursDto: MechanicWorkingHoursDto | MechanicWorkingHoursDto[], request: RequestWithUser): Promise<{
        id: string;
        mechanic_id: string;
        day_of_week: number;
        start_time: string;
        end_time: string;
        slot_duration: number;
        is_day_off: boolean;
    } | {
        id: string;
        mechanic_id: string;
        day_of_week: number;
        start_time: string;
        end_time: string;
        slot_duration: number;
        is_day_off: boolean;
    }[]>;
    updateWorkingHours(hourId: string, mechanicWorkingHoursDto: Partial<MechanicWorkingHoursDto>, request: RequestWithUser): Promise<{
        id: string;
        mechanic_id: string;
        day_of_week: number;
        start_time: string;
        end_time: string;
        slot_duration: number;
        is_day_off: boolean;
    }>;
    deleteWorkingHours(hourId: string, request: RequestWithUser): Promise<{
        id: string;
        mechanic_id: string;
        day_of_week: number;
        start_time: string;
        end_time: string;
        slot_duration: number;
        is_day_off: boolean;
    }>;
    getCategories(request: RequestWithUser): Promise<({
        categories: {
            id: string;
            name: string;
            created_at: Date | null;
            parent_id: string | null;
        };
    } & {
        id: string;
        created_at: Date | null;
        mechanic_id: string;
        category_id: string;
    })[]>;
    addCategory(body: MechanicCategoryDto | MechanicCategoryDto[], request: RequestWithUser): Promise<any[] | ({
        categories: {
            id: string;
            name: string;
            created_at: Date | null;
            parent_id: string | null;
        };
    } & {
        id: string;
        created_at: Date | null;
        mechanic_id: string;
        category_id: string;
    })>;
    removeCategory(categoryId: string, request: RequestWithUser): Promise<{
        categories: {
            id: string;
            name: string;
            created_at: Date | null;
            parent_id: string | null;
        };
    } & {
        id: string;
        created_at: Date | null;
        mechanic_id: string;
        category_id: string;
    }>;
    updateCategories(dto: MechanicCategoryDto[], request: RequestWithUser): Promise<({
        categories: {
            id: string;
            name: string;
            created_at: Date | null;
            parent_id: string | null;
        };
    } & {
        id: string;
        created_at: Date | null;
        mechanic_id: string;
        category_id: string;
    })[]>;
    checkMechanicProfile(request: RequestWithUser): Promise<{
        hasMechanicProfile: boolean;
        profile: {
            id: string;
            user_id: string;
            created_at: Date;
            business_name: string;
            on_site_service: boolean | null;
            average_rating: number | null;
        };
    }>;
    searchMechanics(searchDto: SearchMechanicsDto, request: RequestWithUser): Promise<{
        mechanics: import("./dto/search-mechanics.dto").MechanicSearchResponseDto[];
        total: number;
    }>;
    createMaintenanceRecord(dto: CreateVehicleMaintenanceRecordDto, request: RequestWithUser): Promise<{
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
    }>;
    getMaintenanceRecordsByVehicle(vehicleId: string, request: RequestWithUser): Promise<({
        appointments: {
            status: string;
            appointment_date: Date;
            appointment_type: import(".prisma/client").$Enums.AppointmentType;
        };
    } & {
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
    })[]>;
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
    getMechanicById(mechanicId: string): Promise<{
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
