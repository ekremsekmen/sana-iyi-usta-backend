import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { MechanicResponseDto } from './dto/mechanic-response.dto';
import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';
export declare class ReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
    create(req: RequestWithUser, createReviewDto: CreateReviewDto): Promise<{
        id: string;
        created_at: Date;
        mechanic_id: string;
        rating: number;
        appointment_id: string | null;
        customer_id: string;
        review: string | null;
        mechanic_response: string | null;
    }>;
    getMechanicReviews(req: RequestWithUser): Promise<{
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
    getMechanicReviewsById(mechanicId: string): Promise<({
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
    getReview(id: string): Promise<{
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
    update(req: RequestWithUser, id: string, updateReviewDto: UpdateReviewDto): Promise<{
        id: string;
        created_at: Date;
        mechanic_id: string;
        rating: number;
        appointment_id: string | null;
        customer_id: string;
        review: string | null;
        mechanic_response: string | null;
    }>;
    respond(req: RequestWithUser, id: string, responseDto: MechanicResponseDto): Promise<{
        id: string;
        created_at: Date;
        mechanic_id: string;
        rating: number;
        appointment_id: string | null;
        customer_id: string;
        review: string | null;
        mechanic_response: string | null;
    }>;
    delete(req: RequestWithUser, id: string): Promise<{
        message: string;
    }>;
    getUserReviews(req: RequestWithUser): Promise<({
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
}
