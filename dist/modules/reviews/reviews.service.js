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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const review_notification_service_1 = require("../notifications/services/review-notification.service");
let ReviewsService = class ReviewsService {
    constructor(prisma, reviewNotificationService) {
        this.prisma = prisma;
        this.reviewNotificationService = reviewNotificationService;
    }
    async createReview(userId, createReviewDto) {
        const customer = await this.prisma.customers.findFirst({
            where: { user_id: userId }
        });
        if (!customer) {
            throw new common_1.ForbiddenException('Bu işlemi sadece müşteriler yapabilir');
        }
        const appointment = await this.prisma.appointments.findUnique({
            where: { id: createReviewDto.appointment_id }
        });
        if (!appointment) {
            throw new common_1.NotFoundException('Randevu bulunamadı');
        }
        if (appointment.customer_id !== customer.id) {
            throw new common_1.ForbiddenException('Yalnızca kendi randevularınızı değerlendirebilirsiniz');
        }
        if (appointment.status !== 'completed') {
            throw new common_1.BadRequestException('Yalnızca tamamlanmış randevular değerlendirilebilir');
        }
        const existingReview = await this.prisma.ratings_reviews.findUnique({
            where: { appointment_id: appointment.id }
        });
        if (existingReview) {
            throw new common_1.BadRequestException('Bu randevu zaten değerlendirilmiş');
        }
        const user = await this.prisma.users.findUnique({
            where: { id: userId },
            select: { full_name: true }
        });
        const review = await this.prisma.$transaction(async (tx) => {
            const newReview = await tx.ratings_reviews.create({
                data: {
                    appointment_id: appointment.id,
                    mechanic_id: appointment.mechanic_id,
                    customer_id: customer.id,
                    rating: createReviewDto.rating,
                    review: createReviewDto.review,
                }
            });
            await this.updateMechanicAverageRating(appointment.mechanic_id, tx);
            return newReview;
        });
        await this.reviewNotificationService.notifyMechanicAboutNewReview(review, appointment, user.full_name);
        return review;
    }
    async getReviewsByMechanicId(mechanicId) {
        return this.prisma.ratings_reviews.findMany({
            where: { mechanic_id: mechanicId },
            include: {
                customers: {
                    include: {
                        users: {
                            select: {
                                full_name: true,
                                profile_image: true
                            }
                        }
                    }
                }
            },
            orderBy: { created_at: 'desc' }
        });
    }
    async getReviewById(id) {
        const review = await this.prisma.ratings_reviews.findUnique({
            where: { id },
            include: {
                customers: {
                    include: {
                        users: {
                            select: {
                                full_name: true,
                                profile_image: true
                            }
                        }
                    }
                },
                mechanics: {
                    include: {
                        users: {
                            select: {
                                full_name: true,
                                profile_image: true
                            }
                        }
                    }
                }
            }
        });
        if (!review) {
            throw new common_1.NotFoundException('Değerlendirme bulunamadı');
        }
        return review;
    }
    async updateReview(userId, id, updateReviewDto) {
        const customer = await this.prisma.customers.findFirst({
            where: { user_id: userId }
        });
        if (!customer) {
            throw new common_1.ForbiddenException('Bu işlemi sadece müşteriler yapabilir');
        }
        const review = await this.prisma.ratings_reviews.findUnique({
            where: { id }
        });
        if (!review) {
            throw new common_1.NotFoundException('Değerlendirme bulunamadı');
        }
        if (review.customer_id !== customer.id) {
            throw new common_1.ForbiddenException('Yalnızca kendi değerlendirmelerinizi güncelleyebilirsiniz');
        }
        return this.prisma.$transaction(async (tx) => {
            const updatedReview = await tx.ratings_reviews.update({
                where: { id },
                data: updateReviewDto
            });
            await this.updateMechanicAverageRating(review.mechanic_id, tx);
            return updatedReview;
        });
    }
    async respondToReview(userId, id, responseDto) {
        const mechanic = await this.prisma.mechanics.findFirst({
            where: { user_id: userId }
        });
        if (!mechanic) {
            throw new common_1.ForbiddenException('Bu işlemi sadece ustalar yapabilir');
        }
        const review = await this.prisma.ratings_reviews.findUnique({
            where: { id }
        });
        if (!review) {
            throw new common_1.NotFoundException('Değerlendirme bulunamadı');
        }
        if (review.mechanic_id !== mechanic.id) {
            throw new common_1.ForbiddenException('Yalnızca kendi değerlendirmelerinize yanıt verebilirsiniz');
        }
        return this.prisma.ratings_reviews.update({
            where: { id },
            data: {
                mechanic_response: responseDto.mechanic_response
            }
        });
    }
    async deleteReview(userId, id) {
        const customer = await this.prisma.customers.findFirst({
            where: { user_id: userId }
        });
        if (!customer) {
            throw new common_1.ForbiddenException('Bu işlemi sadece müşteriler yapabilir');
        }
        const review = await this.prisma.ratings_reviews.findUnique({
            where: { id }
        });
        if (!review) {
            throw new common_1.NotFoundException('Değerlendirme bulunamadı');
        }
        if (review.customer_id !== customer.id) {
            throw new common_1.ForbiddenException('Yalnızca kendi değerlendirmelerinizi silebilirsiniz');
        }
        const mechanicId = review.mechanic_id;
        return this.prisma.$transaction(async (tx) => {
            await tx.ratings_reviews.delete({
                where: { id }
            });
            await this.updateMechanicAverageRating(mechanicId, tx);
            return { message: 'Değerlendirme başarıyla silindi' };
        });
    }
    async getUserReviews(userId) {
        const customer = await this.prisma.customers.findFirst({
            where: { user_id: userId }
        });
        if (!customer) {
            return [];
        }
        return this.prisma.ratings_reviews.findMany({
            where: { customer_id: customer.id },
            include: {
                mechanics: {
                    include: {
                        users: {
                            select: {
                                full_name: true,
                                profile_image: true
                            }
                        }
                    }
                },
                appointments: true
            },
            orderBy: { created_at: 'desc' }
        });
    }
    async getMechanicReviewsByUserId(userId) {
        const mechanic = await this.prisma.mechanics.findFirst({
            where: { user_id: userId },
            select: {
                id: true,
                average_rating: true
            }
        });
        if (!mechanic) {
            throw new common_1.NotFoundException('Tamirci profili bulunamadı');
        }
        const reviews = await this.prisma.ratings_reviews.findMany({
            where: { mechanic_id: mechanic.id },
            include: {
                customers: {
                    include: {
                        users: {
                            select: {
                                full_name: true,
                                profile_image: true
                            }
                        }
                    }
                },
                appointments: {
                    select: {
                        appointment_date: true,
                        appointment_type: true,
                        customer_vehicles: {
                            select: {
                                brands: true,
                                models: true,
                                plate_number: true
                            }
                        }
                    }
                }
            },
            orderBy: { created_at: 'desc' }
        });
        const ratingDistribution = {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0
        };
        reviews.forEach(review => {
            const rating = Math.floor(Number(review.rating));
            if (rating >= 1 && rating <= 5) {
                ratingDistribution[rating]++;
            }
        });
        return {
            reviews,
            average_rating: mechanic.average_rating ? Number(mechanic.average_rating) : null,
            total_reviews: reviews.length,
            rating_distribution: ratingDistribution
        };
    }
    async updateMechanicAverageRating(mechanicId, tx) {
        const client = tx || this.prisma;
        const result = await client.ratings_reviews.aggregate({
            where: { mechanic_id: mechanicId },
            _avg: {
                rating: true
            }
        });
        const averageRating = result._avg.rating || 0;
        await client.mechanics.update({
            where: { id: mechanicId },
            data: {
                average_rating: averageRating
            }
        });
    }
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        review_notification_service_1.ReviewNotificationService])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map