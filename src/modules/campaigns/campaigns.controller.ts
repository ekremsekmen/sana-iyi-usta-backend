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

  @Post()
  @UseGuards(JwtGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createCampaignDto: CampaignDto,
    @Req() request: RequestWithUser
  ) {
    return this.campaignsService.create(
      createCampaignDto.mechanic_id, 
      createCampaignDto, 
      request.user.id
    );
  }

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

  @Patch(':id')
  @UseGuards(JwtGuard, MechanicOwnerGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateCampaignDto: CampaignDto,
    @Req() request: RequestWithUser
  ) {
    return this.campaignsService.update(
      id, 
      updateCampaignDto.mechanic_id, 
      updateCampaignDto
    );
  }

  @Delete(':id')
  @UseGuards(JwtGuard, MechanicOwnerGuard)
  @HttpCode(HttpStatus.OK)
  remove(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body('mechanic_id', new ParseUUIDPipe()) mechanicId: string,
    @Req() request: RequestWithUser
  ) {

    return this.campaignsService.remove(id, mechanicId);
  }
}
