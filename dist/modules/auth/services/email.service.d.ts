import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { SendVerificationEmailDto, EmailVerificationResponseDto, VerifyEmailDto } from '../dto/email.dto';
interface SendPasswordResetCodeDto {
    email: string;
    resetCode: string;
}
export declare class EmailService {
    private prisma;
    private transporter;
    constructor(prisma: PrismaService);
    private createVerificationToken;
    private insertVerificationRecord;
    createVerification(prisma: Prisma.TransactionClient | PrismaService, userId: string, email: string): Promise<string>;
    sendVerificationEmailByToken(email: string, token: string): Promise<boolean>;
    sendVerificationEmail({ email, verificationToken, }: SendVerificationEmailDto): Promise<any>;
    private processVerifiedUser;
    private buildEmailVerificationUrl;
    verifyEmail({ token, }: VerifyEmailDto): Promise<EmailVerificationResponseDto>;
    sendPasswordResetCode({ email, resetCode, }: SendPasswordResetCodeDto): Promise<any>;
    private getPasswordResetCodeTemplate;
}
export {};
