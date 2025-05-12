import { AppointmentType } from '@prisma/client';
export declare class CreateAppointmentDto {
    mechanic_id: string;
    vehicle_id: string;
    start_time: string;
    end_time: string;
    description?: string;
    appointment_type: AppointmentType;
}
