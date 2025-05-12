import { OnModuleInit } from '@nestjs/common';
export interface FcmResponse {
    success: number;
    failure: number;
    disabled: boolean;
    simulated: boolean;
    error?: string;
}
export declare class FcmService implements OnModuleInit {
    private readonly logger;
    private isFirebaseInitialized;
    onModuleInit(): void;
    sendMulticastNotification(tokens: string[], title: string, body: string, data?: Record<string, string>): Promise<FcmResponse>;
}
