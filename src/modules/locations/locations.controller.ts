import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { JwtGuard } from '../../common/guards/jwt/jwt.guard';
import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';

@Controller('locations')
@UseGuards(JwtGuard)
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Request() req: RequestWithUser, @Body() createLocationDto: CreateLocationDto) {
    return this.locationsService.create(req.user.id, createLocationDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(@Request() req: RequestWithUser) {
    return this.locationsService.findAll(req.user.id);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.locationsService.findOne(id, req.user.id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: string,
    @Body() updateLocationDto: UpdateLocationDto,
    @Request() req: RequestWithUser,
  ) {
    return this.locationsService.update(id, req.user.id, updateLocationDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.locationsService.remove(id, req.user.id);
  }
}
