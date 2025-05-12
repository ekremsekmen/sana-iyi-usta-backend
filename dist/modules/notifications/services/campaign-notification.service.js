"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var CampaignNotificationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampaignNotificationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
const fcm_service_1 = require("./fcm.service");
let CampaignNotificationService = CampaignNotificationService_1 = class CampaignNotificationService {
    constructor(prisma, fcmService) {
        this.prisma = prisma;
        this.fcmService = fcmService;
        this.logger = new common_1.Logger(CampaignNotificationService_1.name);
    }
    async createNotification(createNotificationDto) {
        return this.prisma.notifications.create({
            data: {
                user_id: createNotificationDto.userId,
                message: createNotificationDto.message,
                type: createNotificationDto.type,
            },
        });
    }
    async sendCampaignNotifications(mechanicId, campaignId, campaignTitle, brandIds) {
        try {
            const mechanic = await this.prisma.mechanics.findUnique({
                where: { id: mechanicId },
                select: {
                    business_name: true,
                    users: {
                        include: {
                            locations: true,
                        },
                    },
                },
            });
            if (!mechanic || !mechanic.users.locations.length) {
                return { sent: 0, message: 'Mekanik lokasyonu bulunamadı' };
            }
            const mechanicCity = mechanic.users.locations.find(loc => loc.city)?.city;
            if (!mechanicCity) {
                return { sent: 0, message: 'Mekanik şehir bilgisi bulunamadı' };
            }
            const eligibleCustomers = await this.prisma.customers.findMany({
                where: {
                    customer_vehicles: {
                        some: {
                            brand_id: {
                                in: brandIds,
                            },
                        },
                    },
                    users: {
                        locations: {
                            some: {
                                city: mechanicCity,
                            },
                        },
                    },
                },
                include: {
                    users: {
                        include: {
                            user_sessions: true,
                        },
                    },
                },
            });
            const notifications = [];
            const pushTokens = [];
            const notificationMessage = `${mechanic.business_name}, aracınıza özel "${campaignTitle}" kampanyası başlattı!`;
            for (const customer of eligibleCustomers) {
                const notification = await this.createNotification({
                    userId: customer.user_id,
                    message: notificationMessage,
                    type: 'campaign',
                });
                notifications.push(notification);
                const fcmTokens = customer.users.user_sessions
                    .filter(session => session.fcm_token)
                    .map(session => session.fcm_token);
                pushTokens.push(...fcmTokens);
            }
            let fcmResult = {
                success: 0,
                failure: 0,
                disabled: false,
                simulated: false
            };
            if (pushTokens.length > 0) {
                try {
                    fcmResult = await this.fcmService.sendMulticastNotification(pushTokens, 'Yeni Kampanya', notificationMessage, {
                        campaignId: campaignId,
                        mechanicId: mechanicId,
                        type: 'campaign'
                    });
                    if (fcmResult.simulated) {
                        this.logger.log(`${pushTokens.length} FCM bildirimi simüle edildi (geliştirme modu)`);
                    }
                }
                catch (error) {
                    this.logger.error(`FCM bildirimi gönderilirken hata: ${error.message}`, error.stack);
                }
            }
            return {
                sent: notifications.length,
                fcmTokens: pushTokens.length,
                fcmSuccess: fcmResult.success,
                fcmFailure: fcmResult.failure,
                simulated: fcmResult.simulated,
                message: `${notifications.length} müşteriye bildirim oluşturuldu, ${fcmResult.simulated ? '(simüle edildi)' : fcmResult.success + ' başarıyla gönderildi'}`,
            };
        }
        catch (error) {
            this.logger.error(`Kampanya bildirimleri gönderilirken hata: ${error.message}`, error.stack);
            return { success: false, error: error.message };
        }
    }
};
exports.CampaignNotificationService = CampaignNotificationService;
exports.CampaignNotificationService = CampaignNotificationService = CampaignNotificationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        fcm_service_1.FcmService])
], CampaignNotificationService);
//# sourceMappingURL=campaign-notification.service.js.map