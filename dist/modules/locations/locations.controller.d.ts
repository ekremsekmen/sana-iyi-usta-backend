import { LocationsService } from './locations.service';
import { LocationDto } from './dto/location.dto';
import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';
export declare class LocationsController {
    private readonly locationsService;
    constructor(locationsService: LocationsService);
    create(req: RequestWithUser, createLocationDto: LocationDto): Promise<{
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
    findAll(req: RequestWithUser): Promise<{
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
    findOne(id: string, req: RequestWithUser): Promise<{
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
    update(id: string, updateLocationDto: LocationDto, req: RequestWithUser): Promise<{
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
    remove(id: string, req: RequestWithUser): Promise<{
        message: string;
    }>;
}
