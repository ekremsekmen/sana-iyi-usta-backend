import { PrismaService } from '../../prisma/prisma.service';
import { DefaultLocationResponseDto, UpdateUserDto, UserProfileResponseDto } from './dto/user-profile.dto';
import { FilesService } from '../files/files.service';
export declare class UsersService {
    private prisma;
    private filesService;
    constructor(prisma: PrismaService, filesService: FilesService);
    findOne(id: string): Promise<UserProfileResponseDto>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<{
        full_name: string;
        role: string;
        id: string;
        phone_number: string;
        profile_image: string;
    }>;
    uploadProfileImage(userId: string, file: Express.Multer.File): Promise<{
        id: string;
        profile_image: string;
    }>;
    setDefaultLocation(userId: string, locationId: string, prismaClient?: any): Promise<any>;
    getDefaultLocation(userId: string): Promise<DefaultLocationResponseDto>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
