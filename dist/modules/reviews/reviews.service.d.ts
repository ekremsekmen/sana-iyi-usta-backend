import { PrismaService } from '../../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { MechanicResponseDto } from './dto/mechanic-response.dto';
import { ReviewNotificationService } from '../notifications/services/review-notification.service';
export declare class ReviewsService {
    private prisma;
    private reviewNotificationService;
    constructor(prisma: PrismaService, reviewNotificationService: ReviewNotificationService);
    createReview(userId: string, createReviewDto: CreateReviewDto): Promise<{
        id: string;
        created_at: Date;
        mechanic_id: string;
        rating: number;
        appointment_id: string | null;
        customer_id: string;
        review: string | null;
        mechanic_response: string | null;
    }>;
    getReviewsByMechanicId(mechanicId: string): Promise<({
        customers: {
            users: {
                full_name: string;
                profile_image: string;
            };
        } & {
            id: string;
            user_id: string;
            created_at: Date | null;
        };
    } & {
        id: string;
        created_at: Date;
        mechanic_id: string;
        rating: number;
        appointment_id: string | null;
        customer_id: string;
        review: string | null;
        mechanic_response: string | null;
    })[]>;
    getReviewById(id: string): Promise<{
        customers: {
            users: {
                full_name: string;
                profile_image: string;
            };
        } & {
            id: string;
            user_id: string;
            created_at: Date | null;
        };
        mechanics: {
            users: {
                full_name: string;
                profile_image: string;
            };
        } & {
            id: string;
            user_id: string;
            created_at: Date;
            business_name: string;
            on_site_service: boolean | null;
            average_rating: number | null;
        };
    } & {
        id: string;
        created_at: Date;
        mechanic_id: string;
        rating: number;
        appointment_id: string | null;
        customer_id: string;
        review: string | null;
        mechanic_response: string | null;
    }>;
    updateReview(userId: string, id: string, updateReviewDto: UpdateReviewDto): Promise<{
        id: string;
        created_at: Date;
        mechanic_id: string;
        rating: number;
        appointment_id: string | null;
        customer_id: string;
        review: string | null;
        mechanic_response: string | null;
    }>;
    respondToReview(userId: string, id: string, responseDto: MechanicResponseDto): Promise<{
        id: string;
        created_at: Date;
        mechanic_id: string;
        rating: number;
        appointment_id: string | null;
        customer_id: string;
        review: string | null;
        mechanic_response: string | null;
    }>;
    deleteReview(userId: string, id: string): Promise<{
        message: string;
    }>;
    getUserReviews(userId: string): Promise<({
        appointments: {
            id: string;
            created_at: Date;
            status: string;
            mechanic_id: string;
            start_time: Date;
            end_time: Date;
            vehicle_id: string;
            customer_id: string;
            appointment_date: Date;
            description: string | null;
            appointment_type: import(".prisma/client").$Enums.AppointmentType;
            location_id: string | null;
        };
        mechanics: {
            users: {
                full_name: string;
                profile_image: string;
            };
        } & {
            id: string;
            user_id: string;
            created_at: Date;
            business_name: string;
            on_site_service: boolean | null;
            average_rating: number | null;
        };
    } & {
        id: string;
        created_at: Date;
        mechanic_id: string;
        rating: number;
        appointment_id: string | null;
        customer_id: string;
        review: string | null;
        mechanic_response: string | null;
    })[]>;
    getMechanicReviewsByUserId(userId: string): Promise<{
        reviews: ({
            appointments: {
                customer_vehicles: {
                    brands: {
                        id: string;
                        name: string;
                    };
                    models: {
                        id: string;
                        name: string;
                        brand_id: string;
                    };
                    plate_number: string;
                };
                appointment_date: Date;
                appointment_type: import(".prisma/client").$Enums.AppointmentType;
            };
            customers: {
                users: {
                    full_name: string;
                    profile_image: string;
                };
            } & {
                id: string;
                user_id: string;
                created_at: Date | null;
            };
        } & {
            id: string;
            created_at: Date;
            mechanic_id: string;
            rating: number;
            appointment_id: string | null;
            customer_id: string;
            review: string | null;
            mechanic_response: string | null;
        })[];
        average_rating: number;
        total_reviews: number;
        rating_distribution: {
            1: number;
            2: number;
            3: number;
            4: number;
            5: number;
        };
    }>;
    private updateMechanicAverageRating;
}
