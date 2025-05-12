import { AppointmentType } from '@prisma/client';
export declare class GetAvailableSlotsDto {
    mechanic_id: string;
    date: string;
    appointment_type?: AppointmentType;
}
