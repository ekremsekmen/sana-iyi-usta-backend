import { PrismaService } from '../../prisma/prisma.service';
import { LocationDto } from './dto/location.dto';
import { UsersService } from '../users/users.service';
export declare class LocationsService {
    private prisma;
    private usersService;
    constructor(prisma: PrismaService, usersService: UsersService);
    create(userId: string, createLocationDto: LocationDto): Promise<{
        id: string;
        user_id: string;
        created_at: Date | null;
        address: string;
        latitude: import(".prisma/client/runtime/library").Decimal | null;
        longitude: import(".prisma/client/runtime/library").Decimal | null;
        label: string | null;
        city: string | null;
        district: string | null;
    }>;
    private handleMechanicLocation;
    findAll(userId: string): Promise<{
        id: string;
        user_id: string;
        created_at: Date | null;
        address: string;
        latitude: import(".prisma/client/runtime/library").Decimal | null;
        longitude: import(".prisma/client/runtime/library").Decimal | null;
        label: string | null;
        city: string | null;
        district: string | null;
    }[]>;
    findOne(id: string, userId: string): Promise<{
        id: string;
        user_id: string;
        created_at: Date | null;
        address: string;
        latitude: import(".prisma/client/runtime/library").Decimal | null;
        longitude: import(".prisma/client/runtime/library").Decimal | null;
        label: string | null;
        city: string | null;
        district: string | null;
    }>;
    update(id: string, userId: string, updateLocationDto: LocationDto): Promise<{
        id: string;
        user_id: string;
        created_at: Date | null;
        address: string;
        latitude: import(".prisma/client/runtime/library").Decimal | null;
        longitude: import(".prisma/client/runtime/library").Decimal | null;
        label: string | null;
        city: string | null;
        district: string | null;
    }>;
    remove(id: string, userId: string): Promise<{
        message: string;
    }>;
    calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number;
    private deg2rad;
}
