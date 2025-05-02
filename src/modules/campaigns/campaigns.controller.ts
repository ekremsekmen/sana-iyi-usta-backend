import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards, 
  Query, 
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
import { MechanicOwnerGuard } from '../mechanics/guards/mechanic-owner.guard';
import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';

@Controller('mechanics/:id/campaigns')
export class MechanicCampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Post()
  @UseGuards(JwtGuard, MechanicOwnerGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @HttpCode(HttpStatus.CREATED)
  create(
    @Param('id', new ParseUUIDPipe()) mechanicId: string,
    @Body() createCampaignDto: CampaignDto,
    @Req() request: RequestWithUser
  ) {
    return this.campaignsService.create(mechanicId, createCampaignDto, request.user.id);
  }

  @Get()
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  findByMechanic(
    @Param('id', new ParseUUIDPipe()) mechanicId: string
  ) {
    return this.campaignsService.findByMechanic(mechanicId);
  }

  @Patch(':campaignId')
  @UseGuards(JwtGuard, MechanicOwnerGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id', new ParseUUIDPipe()) mechanicId: string,
    @Param('campaignId', new ParseUUIDPipe()) campaignId: string,
    @Body() updateCampaignDto: CampaignDto,
    @Req() request: RequestWithUser
  ) {
    return this.campaignsService.update(campaignId, mechanicId, updateCampaignDto, request.user.id);
  }

  @Delete(':campaignId')
  @UseGuards(JwtGuard, MechanicOwnerGuard)
  @HttpCode(HttpStatus.OK)
  remove(
    @Param('id', new ParseUUIDPipe()) mechanicId: string,
    @Param('campaignId', new ParseUUIDPipe()) campaignId: string,
    @Req() request: RequestWithUser
  ) {
    return this.campaignsService.remove(campaignId, mechanicId, request.user.id);
  }
}

@Controller('campaigns')
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Get()
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  findAll(
    @Query('mechanicId') mechanicId?: string, 
    @Query('categoryId') categoryId?: string,
    @Query('brandId') brandId?: string,
    @Query('active') active?: string,
  ) {
    return this.campaignsService.findAll({ mechanicId, categoryId, brandId, active });
  }

  @Get(':campaignId')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  findOne(
    @Param('campaignId', new ParseUUIDPipe()) campaignId: string
  ) {
    return this.campaignsService.findOne(campaignId);
  }
}
