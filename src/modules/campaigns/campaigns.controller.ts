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
import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';
import { MechanicOwnerGuard } from '../mechanics/guards/mechanic-owner.guard';

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

  @Get('mechanic/:mechanicId')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  findByMechanic(
    @Param('mechanicId', new ParseUUIDPipe()) mechanicId: string
  ) {
    return this.campaignsService.findByMechanic(mechanicId);
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  findOne(
    @Param('id', new ParseUUIDPipe()) id: string
  ) {
    return this.campaignsService.findOne(id);
  }

  @Post('mechanic/:mechanicId')
  @UseGuards(JwtGuard, MechanicOwnerGuard)
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
  @UseGuards(JwtGuard, MechanicOwnerGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Param('mechanicId', new ParseUUIDPipe()) mechanicId: string,
    @Body() updateCampaignDto: CampaignDto
  ) {
    return this.campaignsService.update(id, mechanicId, updateCampaignDto);
  }

  @Delete(':id/mechanic/:mechanicId')
  @UseGuards(JwtGuard, MechanicOwnerGuard)
  @HttpCode(HttpStatus.OK)
  remove(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Param('mechanicId', new ParseUUIDPipe()) mechanicId: string
  ) {
    return this.campaignsService.remove(id, mechanicId);
  }
}
