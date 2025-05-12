import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/user-profile.dto';
import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getMyProfile(req: RequestWithUser): Promise<import("./dto/user-profile.dto").UserProfileResponseDto>;
    updateMyProfile(req: RequestWithUser, updateUserDto: UpdateUserDto): Promise<{
        full_name: string;
        role: string;
        id: string;
        phone_number: string;
        profile_image: string;
    }>;
    removeMyAccount(req: RequestWithUser): Promise<{
        message: string;
    }>;
    getMyDefaultLocation(req: RequestWithUser): Promise<import("./dto/user-profile.dto").DefaultLocationResponseDto>;
    setDefaultLocation(locationId: string, req: RequestWithUser): Promise<any>;
    getUserProfile(id: string): Promise<import("./dto/user-profile.dto").UserProfileResponseDto>;
    uploadProfileImage(req: RequestWithUser, file: Express.Multer.File): Promise<{
        id: string;
        profile_image: string;
    }>;
}
