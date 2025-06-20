import { Controller, Get, Body, Patch, Delete, UseGuards, Request, Param, HttpCode, HttpStatus, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/user-profile.dto';
import { JwtGuard } from '../../common/guards/jwt/jwt.guard';
import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';
import { FileInterceptor } from '@nestjs/platform-express';

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
  @Get('default-location')
  @HttpCode(HttpStatus.OK)
  getMyDefaultLocation(@Request() req: RequestWithUser) {
    return this.usersService.getDefaultLocation(req.user.id);
  }
  
  @UseGuards(JwtGuard)
  @Patch('default-location/:locationId')
  @HttpCode(HttpStatus.OK)
  setDefaultLocation(
    @Param('locationId') locationId: string,
    @Request() req: RequestWithUser,
  ) {
    return this.usersService.setDefaultLocation(req.user.id, locationId);
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getUserProfile(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @UseGuards(JwtGuard)
  @Patch('me/profile-image')
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(HttpStatus.OK)
  uploadProfileImage(
    @Request() req: RequestWithUser, 
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.usersService.uploadProfileImage(req.user.id, file);
  }
}
