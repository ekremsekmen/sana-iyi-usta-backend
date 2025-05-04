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
  Req,
  NotFoundException
} from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import { CampaignDto } from './dto/campaign.dto';
import { JwtGuard } from '../../common/guards/jwt/jwt.guard';
import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';
import { MechanicsService } from '../mechanics/mechanics.service';

@Controller('campaigns')
export class CampaignsController {
  constructor(
    private readonly campaignsService: CampaignsService,
    private readonly mechanicsService: MechanicsService
  ) {}

  @Get()
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  async findByMechanic(@Req() request: RequestWithUser) {
    const mechanic = await this.mechanicsService.findByUserId(request.user.id);
    if (!mechanic.hasMechanicProfile) {
      throw new NotFoundException('Tamirci profili bulunamadı.');
    }
    return this.campaignsService.findByMechanic(mechanic.profile.id, request.user.id);
  }

  @Post()
  @UseGuards(JwtGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createCampaignDto: CampaignDto,
    @Req() request: RequestWithUser
  ) {
    const mechanic = await this.mechanicsService.findByUserId(request.user.id);
    if (!mechanic.hasMechanicProfile) {
      throw new NotFoundException('Tamirci profili bulunamadı.');
    }
    return this.campaignsService.create(mechanic.profile.id, createCampaignDto, request.user.id);
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateCampaignDto: CampaignDto,
    @Req() request: RequestWithUser
  ) {
    const mechanic = await this.mechanicsService.findByUserId(request.user.id);
    if (!mechanic.hasMechanicProfile) {
      throw new NotFoundException('Tamirci profili bulunamadı.');
    }
    return this.campaignsService.update(id, mechanic.profile.id, updateCampaignDto, request.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  async remove(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() request: RequestWithUser
  ) {
    const mechanic = await this.mechanicsService.findByUserId(request.user.id);
    if (!mechanic.hasMechanicProfile) {
      throw new NotFoundException('Tamirci profili bulunamadı.');
    }
    return this.campaignsService.remove(id, mechanic.profile.id, request.user.id);
  }
  
  @Get('campaign-for-customer')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  async findCampaignsForCustomer(@Req() request: RequestWithUser) {
    return this.campaignsService.findCampaignsForCustomer(request.user.id);
  }
}
