import { PrismaService } from '../../../prisma/prisma.service';
import { SearchMechanicsDto, MechanicSearchResponseDto } from '../dto/search-mechanics.dto';
import { LocationsService } from '../../locations/locations.service';
export declare class MechanicSearchService {
    private readonly prisma;
    private readonly locationsService;
    constructor(prisma: PrismaService, locationsService: LocationsService);
    searchMechanics(userId: string, searchDto: SearchMechanicsDto): Promise<{
        mechanics: MechanicSearchResponseDto[];
        total: number;
    }>;
}
