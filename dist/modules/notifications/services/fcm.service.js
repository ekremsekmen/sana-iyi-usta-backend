"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var FcmService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FcmService = void 0;
const common_1 = require("@nestjs/common");
const admin = require("firebase-admin");
let FcmService = FcmService_1 = class FcmService {
    constructor() {
        this.logger = new common_1.Logger(FcmService_1.name);
        this.isFirebaseInitialized = false;
    }
    onModuleInit() {
        try {
            if (!admin.apps.length &&
                process.env.FIREBASE_PROJECT_ID &&
                process.env.FIREBASE_PRIVATE_KEY &&
                process.env.FIREBASE_CLIENT_EMAIL) {
                admin.initializeApp({
                    credential: admin.credential.cert({
                        projectId: process.env.FIREBASE_PROJECT_ID,
                        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
                        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    }),
                });
                this.isFirebaseInitialized = true;
                this.logger.log('Firebase başarıyla başlatıldı');
            }
            else {
                this.logger.warn('Firebase yapılandırması eksik, FCM bildirimleri devre dışı bırakıldı');
            }
        }
        catch (error) {
            this.logger.error(`Firebase başlatılamadı: ${error.message}`, error.stack);
            this.isFirebaseInitialized = false;
        }
    }
    async sendMulticastNotification(tokens, title, body, data) {
        if (!tokens || tokens.length === 0) {
            return {
                success: 0,
                failure: 0,
                disabled: true,
                simulated: false
            };
        }
        if (!this.isFirebaseInitialized) {
            this.logger.log(`FCM bildirimi simüle ediliyor - Başlık: "${title}", İçerik: "${body}"`);
            if (data) {
                this.logger.log(`FCM ekstra data: ${JSON.stringify(data)}`);
            }
            return {
                success: tokens.length,
                failure: 0,
                disabled: true,
                simulated: true
            };
        }
        try {
            const message = {
                tokens: tokens,
                notification: {
                    title: title,
                    body: body,
                },
                data: data,
                android: {
                    priority: 'high',
                    notification: {
                        sound: 'default',
                        channelId: 'default'
                    }
                },
                apns: {
                    payload: {
                        aps: {
                            sound: 'default',
                            badge: 1,
                            contentAvailable: true
                        }
                    }
                }
            };
            const response = await admin.messaging().sendEachForMulticast(message);
            this.logger.log(`FCM bildirimi gönderildi: ${response.successCount} başarılı, ${response.failureCount} başarısız`);
            return {
                success: response.successCount,
                failure: response.failureCount,
                disabled: false,
                simulated: false
            };
        }
        catch (error) {
            this.logger.error(`FCM bildirimi gönderilirken hata: ${error.message}`, error.stack);
            return {
                success: 0,
                failure: tokens.length,
                error: error.message,
                disabled: false,
                simulated: false
            };
        }
    }
};
exports.FcmService = FcmService;
exports.FcmService = FcmService = FcmService_1 = __decorate([
    (0, common_1.Injectable)()
], FcmService);
//# sourceMappingURL=fcm.service.js.map