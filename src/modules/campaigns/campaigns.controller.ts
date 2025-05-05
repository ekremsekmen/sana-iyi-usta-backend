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
  
} from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import { CampaignDto } from './dto/campaign.dto';
import { JwtGuard, RolesGuard } from '../../common/guards';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/roles.enum';
import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';

@Controller('campaigns')
@UseGuards(JwtGuard, RolesGuard)
export class CampaignsController {
  constructor(
    private readonly campaignsService: CampaignsService
  ) {}

  @Get()
  @Roles(Role.MECHANIC)
  @HttpCode(HttpStatus.OK)
  async findByMechanic(@Req() request: RequestWithUser) {
    const mechanic = await this.campaignsService.validateAndGetMechanicProfile(request.user.id);
    return this.campaignsService.findByMechanic(mechanic.id, request.user.id);
  }

  @Post()
  @Roles(Role.MECHANIC)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createCampaignDto: CampaignDto,
    @Req() request: RequestWithUser
  ) {
    const mechanic = await this.campaignsService.validateAndGetMechanicProfile(request.user.id);
    return this.campaignsService.create(mechanic.id, createCampaignDto, request.user.id);
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
    const mechanic = await this.campaignsService.validateAndGetMechanicProfile(request.user.id);
    return this.campaignsService.update(id, mechanic.id, updateCampaignDto, request.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  async remove(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() request: RequestWithUser
  ) {
    const mechanic = await this.campaignsService.validateAndGetMechanicProfile(request.user.id);
    return this.campaignsService.remove(id, mechanic.id, request.user.id);
  }
  
  @Get('campaign-for-customer')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  async findCampaignsForCustomer(@Req() request: RequestWithUser) {
    return this.campaignsService.findCampaignsForCustomer(request.user.id);
  }

  @Get(':id/details')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  async findCampaignDetails(
    @Param('id', new ParseUUIDPipe()) id: string
  ) {
    return this.campaignsService.findCampaignDetails(id);
  }
}
