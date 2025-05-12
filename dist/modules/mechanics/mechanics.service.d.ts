import { MechanicProfileService } from './services/mechanic-profile.service';
import { MechanicWorkingHoursService } from './services/mechanic-working-hours.service';
import { MechanicSupportedVehiclesService } from './services/mechanic-supported-vehicles.service';
import { MechanicCategoriesService } from './services/mechanic-categories.service';
import { MechanicSearchService } from './services/mechanic-search.service';
import { MechanicVehicleMaintenanceService } from './services/mechanic-vehicle-maintenance.service';
import { MechanicDetailService } from './services/mechanic-detail.service';
import { MechanicProfileDto } from './dto/mechanic-profile.dto';
import { MechanicWorkingHoursDto } from './dto/mechanic-working-hours.dto';
import { MechanicSupportedVehicleDto } from './dto/mechanic-supported-vehicle.dto';
import { MechanicCategoryDto } from './dto/mechanic-category.dto';
import { SearchMechanicsDto } from './dto/search-mechanics.dto';
import { CreateVehicleMaintenanceRecordDto } from './dto/create-vehicle-maintenance-record.dto';
export declare class MechanicsService {
    private readonly mechanicProfileService;
    private readonly mechanicWorkingHoursService;
    private readonly mechanicSupportedVehiclesService;
    private readonly mechanicCategoriesService;
    private readonly mechanicSearchService;
    private readonly mechanicVehicleMaintenanceService;
    private readonly mechanicDetailService;
    constructor(mechanicProfileService: MechanicProfileService, mechanicWorkingHoursService: MechanicWorkingHoursService, mechanicSupportedVehiclesService: MechanicSupportedVehiclesService, mechanicCategoriesService: MechanicCategoriesService, mechanicSearchService: MechanicSearchService, mechanicVehicleMaintenanceService: MechanicVehicleMaintenanceService, mechanicDetailService: MechanicDetailService);
    create(userId: string, createMechanicDto: MechanicProfileDto): Promise<{
        id: string;
        user_id: string;
        created_at: Date;
        business_name: string;
        on_site_service: boolean | null;
        average_rating: number | null;
    }>;
    findOne(id: string): Promise<{
        id: string;
        user_id: string;
        created_at: Date;
        business_name: string;
        on_site_service: boolean | null;
        average_rating: number | null;
    }>;
    update(id: string, userId: string, updateMechanicDto: MechanicProfileDto): Promise<{
        id: string;
        user_id: string;
        created_at: Date;
        business_name: string;
        on_site_service: boolean | null;
        average_rating: number | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        user_id: string;
        created_at: Date;
        business_name: string;
        on_site_service: boolean | null;
        average_rating: number | null;
    }>;
    createWorkingHours(mechanicId: string, dto: MechanicWorkingHoursDto | MechanicWorkingHoursDto[]): Promise<{
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
    getWorkingHours(mechanicId: string): Promise<{
        id: string;
        mechanic_id: string;
        day_of_week: number;
        start_time: string;
        end_time: string;
        slot_duration: number;
        is_day_off: boolean;
    }[]>;
    getWorkingHourById(id: string): Promise<{
        id: string;
        mechanic_id: string;
        day_of_week: number;
        start_time: string;
        end_time: string;
        slot_duration: number;
        is_day_off: boolean;
    }>;
    updateWorkingHours(id: string, dto: Partial<MechanicWorkingHoursDto>): Promise<{
        id: string;
        mechanic_id: string;
        day_of_week: number;
        start_time: string;
        end_time: string;
        slot_duration: number;
        is_day_off: boolean;
    }>;
    deleteWorkingHours(id: string): Promise<{
        id: string;
        mechanic_id: string;
        day_of_week: number;
        start_time: string;
        end_time: string;
        slot_duration: number;
        is_day_off: boolean;
    }>;
    updateBulkWorkingHours(mechanicId: string, dtoList: MechanicWorkingHoursDto[]): Promise<{
        id: string;
        mechanic_id: string;
        day_of_week: number;
        start_time: string;
        end_time: string;
        slot_duration: number;
        is_day_off: boolean;
    }[]>;
    getSupportedVehicles(mechanicId: string): Promise<({
        brands: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        mechanic_id: string;
        brand_id: string;
    })[]>;
    addSupportedVehicle(dto: MechanicSupportedVehicleDto | MechanicSupportedVehicleDto[]): Promise<({
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
    addSupportedVehicleForMechanic(mechanicId: string, dto: MechanicSupportedVehicleDto | MechanicSupportedVehicleDto[]): Promise<({
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
    updateSupportedVehiclesForMechanic(mechanicId: string, dtoList: MechanicSupportedVehicleDto[]): Promise<({
        brands: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        mechanic_id: string;
        brand_id: string;
    })[]>;
    removeSupportedVehicle(id: string): Promise<{
        brands: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        mechanic_id: string;
        brand_id: string;
    }>;
    removeSupportedVehicleByBrand(mechanicId: string, brandId: string): Promise<{
        brands: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        mechanic_id: string;
        brand_id: string;
    }>;
    updateBulkSupportedVehicles(mechanicId: string, brandIds: string[]): Promise<({
        brands: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        mechanic_id: string;
        brand_id: string;
    })[]>;
    getCategories(mechanicId: string): Promise<({
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
    addCategory(dto: MechanicCategoryDto | MechanicCategoryDto[]): Promise<any[] | ({
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
    addCategoryForMechanic(mechanicId: string, dto: MechanicCategoryDto | MechanicCategoryDto[]): Promise<any[] | ({
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
    removeCategory(id: string): Promise<{
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
    removeCategoryByMechanicAndCategory(mechanicId: string, categoryId: string): Promise<{
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
    updateBulkCategories(mechanicId: string, categoryIds: string[]): Promise<({
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
    updateCategoriesForMechanic(mechanicId: string, dto: MechanicCategoryDto[]): Promise<({
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
    findByUserId(userId: string): Promise<{
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
    searchMechanics(userId: string, searchDto: SearchMechanicsDto): Promise<{
        mechanics: import("./dto/search-mechanics.dto").MechanicSearchResponseDto[];
        total: number;
    }>;
    createMaintenanceRecord(mechanicId: string, dto: CreateVehicleMaintenanceRecordDto): Promise<{
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
    getMaintenanceRecordsByVehicle(mechanicId: string, vehicleId: string): Promise<({
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
    validateAndGetMechanicProfile(userId: string): Promise<{
        id: string;
        user_id: string;
        created_at: Date;
        business_name: string;
        on_site_service: boolean | null;
        average_rating: number | null;
    }>;
    validateWorkingHourBelongsToMechanic(hourId: string, mechanicId: string): Promise<{
        id: string;
        mechanic_id: string;
        day_of_week: number;
        start_time: string;
        end_time: string;
        slot_duration: number;
        is_day_off: boolean;
    }>;
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
