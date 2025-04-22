import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, HttpCode, HttpStatus, ForbiddenException, UsePipes, ValidationPipe, ParseUUIDPipe } from '@nestjs/common';
import { MechanicsService } from './mechanics.service';
import { CreateMechanicDto } from './dto/create-mechanic.dto';
import { UpdateMechanicDto } from './dto/update-mechanic.dto';
import { JwtGuard } from '../../common/guards';
import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';

@Controller('mechanics')
export class MechanicsController {
  constructor(private readonly mechanicsService: MechanicsService) {}

  @UseGuards(JwtGuard)
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createMechanicDto: CreateMechanicDto, @Req() request: RequestWithUser) {
    createMechanicDto.user_id = request.user.id;
    return this.mechanicsService.create(createMechanicDto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.mechanicsService.findOne(id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', new ParseUUIDPipe()) id: string, 
    @Body() updateMechanicDto: UpdateMechanicDto,
    @Req() request: RequestWithUser
  ) {
    updateMechanicDto.user_id = request.user.id;
    const mechanic = await this.mechanicsService.findOne(id);
    if (mechanic.user_id !== request.user.id) {
      throw new ForbiddenException('Bu kaydı güncelleme yetkiniz yok.');
    }
    return this.mechanicsService.update(id, updateMechanicDto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', new ParseUUIDPipe()) id: string, @Req() request: RequestWithUser) {
    const mechanic = await this.mechanicsService.findOne(id);
    if (mechanic.user_id !== request.user.id) {
      throw new ForbiddenException('Bu kaydı silme yetkiniz yok.');
    }
    return this.mechanicsService.remove(id);
  }
}
