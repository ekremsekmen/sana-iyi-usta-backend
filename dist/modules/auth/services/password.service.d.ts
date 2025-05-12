import { PrismaService } from '../../../prisma/prisma.service';
import { EmailService } from './email.service';
export declare class PasswordService {
    private prisma;
    private emailService;
    constructor(prisma: PrismaService, emailService: EmailService);
    initiatePasswordResetWithCode(email: string): Promise<{
        message: string;
        status: string;
        socialProviders?: string[];
    }>;
    verifyPasswordResetCode(email: string, code: string): Promise<{
        message: string;
        status: string;
        isValid: boolean;
    }>;
    resetPasswordWithCode(email: string, code: string, newPassword: string): Promise<{
        message: string;
        status: string;
    }>;
    changePassword(userId: string, oldPassword: string, newPassword: string, newPasswordConfirm: string): Promise<{
        message: string;
        status: string;
    }>;
}
