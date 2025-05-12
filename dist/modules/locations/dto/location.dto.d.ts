import { Decimal } from '@prisma/client/runtime/library';
export declare class LocationDto {
    address: string;
    latitude?: Decimal;
    longitude?: Decimal;
    label?: string;
    city?: string;
    district?: string;
}
