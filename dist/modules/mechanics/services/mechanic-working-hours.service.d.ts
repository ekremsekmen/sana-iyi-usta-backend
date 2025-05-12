import { PrismaService } from '../../../prisma/prisma.service';
import { MechanicWorkingHoursDto } from '../dto/mechanic-working-hours.dto';
export declare class MechanicWorkingHoursService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createForMechanic(mechanicId: string, dto: MechanicWorkingHoursDto | MechanicWorkingHoursDto[]): Promise<{
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
    create(dto: MechanicWorkingHoursDto | MechanicWorkingHoursDto[]): Promise<{
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
    findByMechanic(mechanicId: string): Promise<{
        id: string;
        mechanic_id: string;
        day_of_week: number;
        start_time: string;
        end_time: string;
        slot_duration: number;
        is_day_off: boolean;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        mechanic_id: string;
        day_of_week: number;
        start_time: string;
        end_time: string;
        slot_duration: number;
        is_day_off: boolean;
    }>;
    update(id: string, dto: Partial<MechanicWorkingHoursDto>): Promise<{
        id: string;
        mechanic_id: string;
        day_of_week: number;
        start_time: string;
        end_time: string;
        slot_duration: number;
        is_day_off: boolean;
    }>;
    remove(id: string): Promise<{
        id: string;
        mechanic_id: string;
        day_of_week: number;
        start_time: string;
        end_time: string;
        slot_duration: number;
        is_day_off: boolean;
    }>;
    createOrUpdateBulk(mechanicId: string, dtoList: MechanicWorkingHoursDto[]): Promise<{
        id: string;
        mechanic_id: string;
        day_of_week: number;
        start_time: string;
        end_time: string;
        slot_duration: number;
        is_day_off: boolean;
    }[]>;
}
