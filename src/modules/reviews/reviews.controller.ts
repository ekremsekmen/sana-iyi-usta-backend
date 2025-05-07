import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, Request } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { MechanicResponseDto } from './dto/mechanic-response.dto';
import { JwtGuard } from '../../common/guards/jwt/jwt.guard';
import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';

@UseGuards(JwtGuard)
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  create(@Request() req: RequestWithUser, @Body() createReviewDto: CreateReviewDto) {
    return this.reviewsService.createReview(req.user.id, createReviewDto);
  }

  @Get('mechanics/me')
  getMechanicReviews(@Request() req: RequestWithUser) {
    return this.reviewsService.getMechanicReviewsByUserId(req.user.id);
  }

  @Get('mechanics/:mechanicId')
  getMechanicReviewsById(@Param('mechanicId') mechanicId: string) {
    return this.reviewsService.getReviewsByMechanicId(mechanicId);
  }

  @Get(':id')
  getReview(@Param('id') id: string) {
    return this.reviewsService.getReviewById(id);
  }
  
  @Put(':id')
  update(@Request() req: RequestWithUser, @Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewsService.updateReview(req.user.id, id, updateReviewDto);
  }
 
  @Post(':id/responses')
  respond(@Request() req: RequestWithUser, @Param('id') id: string, @Body() responseDto: MechanicResponseDto) {
    return this.reviewsService.respondToReview(req.user.id, id, responseDto);
  }
 
  @Delete(':id')
  delete(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.reviewsService.deleteReview(req.user.id, id);
  }

  @Get('me')
  getUserReviews(@Request() req: RequestWithUser) {
    return this.reviewsService.getUserReviews(req.user.id);
  }
}