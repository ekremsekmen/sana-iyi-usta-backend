import { Decimal } from '@prisma/client/runtime/library';

export class VehicleMaintenanceRecordResponseDto {
  id: string;
  vehicle_id: string;
  mechanic_id: string;
  service_date: Date;
  details: string;
  cost: Decimal;
  odometer: number;
  created_at: Date;
  next_due_date?: Date;
  appointment_id?: string; // Yeni alan ekle
  mechanics: {
    id: string;
    business_name: string;
  };
  appointments?: { // Yeni ilişki ekle
    appointment_date: Date;
    status: string;
    appointment_type: string;
  };
}