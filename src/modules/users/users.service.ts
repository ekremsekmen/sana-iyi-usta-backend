import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: string) {
    const user = await this.prisma.users.findUnique({
      where: { id },
      select: {
        id: true,
        full_name: true,
        phone_number: true,
        role: true,
        profile_image: true,
        created_at: true,
        e_mail: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`Kullanıcı #${id} bulunamadı`);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.users.update({
      where: { id },
      data: {
        phone_number: updateUserDto.phone_number,
        profile_image: updateUserDto.profile_image,
      },
      select: {
        id: true,
        full_name: true,
        phone_number: true,
        profile_image: true,
        e_mail: true,
        role: true,
        created_at: true,
      },
    });

    return user;
  }

  async remove(id: string) {
    await this.prisma.users.delete({ 
      where: { id } 
    });
    
    return { message: 'Kullanıcı başarıyla silindi' };
  }
}
