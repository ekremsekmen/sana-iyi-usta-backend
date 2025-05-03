import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards, 
  ValidationPipe, 
  UsePipes, 
  HttpCode, 
  HttpStatus, 
  ParseUUIDPipe,
  Req
} from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import { CampaignDto } from './dto/campaign.dto';
import { JwtGuard } from '../../common/guards/jwt/jwt.guard';
import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';
import { CampaignOwnerGuard } from './guards/campaign-owner.guard';

@Controller('campaigns')
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Get('mechanic/:mechanicId')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  findByMechanic(
    @Param('mechanicId', new ParseUUIDPipe()) mechanicId: string,
    @Req() request: RequestWithUser
  ) {
    return this.campaignsService.findByMechanic(mechanicId, request.user.id);
  }

  @Post('mechanic/:mechanicId')
  @UseGuards(JwtGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @HttpCode(HttpStatus.CREATED)
  create(
    @Param('mechanicId', new ParseUUIDPipe()) mechanicId: string,
    @Body() createCampaignDto: CampaignDto,
    @Req() request: RequestWithUser
  ) {
    return this.campaignsService.create(mechanicId, createCampaignDto, request.user.id);
  }

  @Patch(':id/mechanic/:mechanicId')
  @UseGuards(JwtGuard, CampaignOwnerGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Param('mechanicId', new ParseUUIDPipe()) mechanicId: string,
    @Body() updateCampaignDto: CampaignDto,
    @Req() request: RequestWithUser
  ) {
    return this.campaignsService.update(id, mechanicId, updateCampaignDto, request.user.id);
  }

  @Delete(':id/mechanic/:mechanicId')
  @UseGuards(JwtGuard, CampaignOwnerGuard)
  @HttpCode(HttpStatus.OK)
  remove(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Param('mechanicId', new ParseUUIDPipe()) mechanicId: string,
    @Req() request: RequestWithUser
  ) {
    return this.campaignsService.remove(id, mechanicId, request.user.id);
  }
}
