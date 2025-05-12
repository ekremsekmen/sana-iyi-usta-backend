import { PrismaService } from '../../../prisma/prisma.service';
import { GetAvailableSlotsDto } from '../dto/get-available-slots.dto';
export declare class SlotService {
    private prisma;
    constructor(prisma: PrismaService);
    getAvailableSlots(dto: GetAvailableSlotsDto): Promise<any[]>;
    isTimeSlotAvailable(mechanicId: string, startTime: Date, endTime: Date): Promise<boolean>;
}
