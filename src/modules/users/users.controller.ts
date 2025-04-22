import { Controller, Get, Body, Patch, Delete, UseGuards, Request, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from '../../common/guards/jwt/jwt.guard';
import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtGuard)
  @Get('me')
  @HttpCode(HttpStatus.OK)
  getMyProfile(@Request() req: RequestWithUser) {
    return this.usersService.findOne(req.user.id);
  }

  @UseGuards(JwtGuard)
  @Patch('me')
  @HttpCode(HttpStatus.OK)
  updateMyProfile(@Request() req: RequestWithUser, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(req.user.id, updateUserDto);
  }

  @UseGuards(JwtGuard)
  @Delete('me')
  @HttpCode(HttpStatus.OK)
  removeMyAccount(@Request() req: RequestWithUser) {
    return this.usersService.remove(req.user.id);
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getUserProfile(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
}
