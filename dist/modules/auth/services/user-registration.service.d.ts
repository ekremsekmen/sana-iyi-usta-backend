import { PrismaService } from '../../../prisma/prisma.service';
import { RegisterDto, AuthProvider } from '../dto/register.dto';
import { EmailService } from './email.service';
export interface RegistrationResult {
    userId: string;
    verificationEmailSent?: boolean;
    message?: string;
}
export declare class UserRegistrationService {
    private prisma;
    private emailService;
    constructor(prisma: PrismaService, emailService: EmailService);
    registerUser(registerDto: RegisterDto): Promise<RegistrationResult | {
        userId: any;
        verificationEmailSent: boolean;
        message: string;
    }>;
    handleExistingUser(existingUser: any, registerDto: RegisterDto, hashedPassword: string | null): Promise<{
        userId: any;
        verificationEmailSent: boolean;
        message: string;
    }>;
    createUserAuthData(userId: string, registerDto: RegisterDto, hashedPassword: string | null): {
        user_id: string;
        password_hash: string;
        kvkk_approved: boolean;
        terms_approved: boolean;
        auth_provider: AuthProvider;
        provider_id: string;
        e_mail_verified: boolean;
    };
    createNewUser(prisma: any, registerDto: RegisterDto, hashedPassword: string | null): Promise<RegistrationResult>;
}
