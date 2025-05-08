import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { MechanicResponseDto } from './dto/mechanic-response.dto';
import { Prisma } from '@prisma/client';
import { ReviewNotificationService } from '../notifications/services/review-notification.service';

@Injectable()
export class ReviewsService {
  constructor(
    private prisma: PrismaService,
    private reviewNotificationService: ReviewNotificationService
  ) {}

  async createReview(userId: string, createReviewDto: CreateReviewDto) {
    const customer = await this.prisma.customers.findFirst({
      where: { user_id: userId }
    });

    if (!customer) {
      throw new ForbiddenException('Bu işlemi sadece müşteriler yapabilir');
    }

    const appointment = await this.prisma.appointments.findUnique({
      where: { id: createReviewDto.appointment_id }
    });

    if (!appointment) {
      throw new NotFoundException('Randevu bulunamadı');
    }

    if (appointment.customer_id !== customer.id) {
      throw new ForbiddenException('Yalnızca kendi randevularınızı değerlendirebilirsiniz');
    }

    if (appointment.status !== 'completed') {
      throw new BadRequestException('Yalnızca tamamlanmış randevular değerlendirilebilir');
    }

    const existingReview = await this.prisma.ratings_reviews.findUnique({
      where: { appointment_id: appointment.id }
    });

    if (existingReview) {
      throw new BadRequestException('Bu randevu zaten değerlendirilmiş');
    }

    // Kullanıcı tam adını al
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
      select: { full_name: true }
    });

    // Transaction kullanımı
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

    // Transaction dışında bildirimi gönder
    await this.reviewNotificationService.notifyMechanicAboutNewReview(
      review,
      appointment,
      user.full_name
    );

    return review;
  }

  async getReviewsByMechanicId(mechanicId: string) {
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

  async getReviewById(id: string) {
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
      throw new NotFoundException('Değerlendirme bulunamadı');
    }

    return review;
  }

  async updateReview(userId: string, id: string, updateReviewDto: UpdateReviewDto) {
    // Kullanıcının customer ID'sini alın
    const customer = await this.prisma.customers.findFirst({
      where: { user_id: userId }
    });

    if (!customer) {
      throw new ForbiddenException('Bu işlemi sadece müşteriler yapabilir');
    }

    // Değerlendirmenin var olduğunu ve kullanıcıya ait olduğunu kontrol edin
    const review = await this.prisma.ratings_reviews.findUnique({
      where: { id }
    });

    if (!review) {
      throw new NotFoundException('Değerlendirme bulunamadı');
    }

    if (review.customer_id !== customer.id) {
      throw new ForbiddenException('Yalnızca kendi değerlendirmelerinizi güncelleyebilirsiniz');
    }

    // Transaction kullanımı
    return this.prisma.$transaction(async (tx) => {
      const updatedReview = await tx.ratings_reviews.update({
        where: { id },
        data: updateReviewDto
      });

      await this.updateMechanicAverageRating(review.mechanic_id, tx);

      return updatedReview;
    });
  }

  async respondToReview(userId: string, id: string, responseDto: MechanicResponseDto) {
    // Kullanıcının mechanic ID'sini alın
    const mechanic = await this.prisma.mechanics.findFirst({
      where: { user_id: userId }
    });

    if (!mechanic) {
      throw new ForbiddenException('Bu işlemi sadece ustalar yapabilir');
    }

    // Değerlendirmenin var olduğunu ve ustaya ait olduğunu kontrol edin
    const review = await this.prisma.ratings_reviews.findUnique({
      where: { id }
    });

    if (!review) {
      throw new NotFoundException('Değerlendirme bulunamadı');
    }

    if (review.mechanic_id !== mechanic.id) {
      throw new ForbiddenException('Yalnızca kendi değerlendirmelerinize yanıt verebilirsiniz');
    }

    // Değerlendirmeye yanıt ekleyin
    return this.prisma.ratings_reviews.update({
      where: { id },
      data: {
        mechanic_response: responseDto.mechanic_response
      }
    });
  }

  async deleteReview(userId: string, id: string) {
    // Kullanıcının customer ID'sini alın
    const customer = await this.prisma.customers.findFirst({
      where: { user_id: userId }
    });

    if (!customer) {
      throw new ForbiddenException('Bu işlemi sadece müşteriler yapabilir');
    }

    // Değerlendirmenin var olduğunu ve kullanıcıya ait olduğunu kontrol edin
    const review = await this.prisma.ratings_reviews.findUnique({
      where: { id }
    });

    if (!review) {
      throw new NotFoundException('Değerlendirme bulunamadı');
    }

    if (review.customer_id !== customer.id) {
      throw new ForbiddenException('Yalnızca kendi değerlendirmelerinizi silebilirsiniz');
    }

    const mechanicId = review.mechanic_id;

    // Transaction kullanımı
    return this.prisma.$transaction(async (tx) => {
      await tx.ratings_reviews.delete({
        where: { id }
      });

      await this.updateMechanicAverageRating(mechanicId, tx);

      return { message: 'Değerlendirme başarıyla silindi' };
    });
  }

  async getUserReviews(userId: string) {
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

  async getMechanicReviewsByUserId(userId: string) {
    const mechanic = await this.prisma.mechanics.findFirst({
      where: { user_id: userId },
      select: { 
        id: true,
        average_rating: true
      }
    });

    if (!mechanic) {
      throw new NotFoundException('Tamirci profili bulunamadı');
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

    // Puan dağılımını hesapla
    const ratingDistribution = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0
    };

    // Her bir değerlendirme için puan değerine göre sayacı artır
    reviews.forEach(review => {
      // Decimal türünü Number türüne çeviriyoruz
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

  private async updateMechanicAverageRating(mechanicId: string, tx?: Prisma.TransactionClient) {
    const client = tx || this.prisma;
    
    // Ustanın tüm değerlendirmelerinin ortalamasını hesaplayın
    const result = await client.ratings_reviews.aggregate({
      where: { mechanic_id: mechanicId },
      _avg: {
        rating: true
      }
    });

    const averageRating = result._avg.rating || 0;

    // Ustanın ortalama puanını güncelleyin
    await client.mechanics.update({
      where: { id: mechanicId },
      data: {
        average_rating: averageRating
      }
    });
  }
}
