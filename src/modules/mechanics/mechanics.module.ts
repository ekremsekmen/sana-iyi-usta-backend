import { Module } from '@nestjs/common';
import { MechanicsController } from './mechanics.controller';
import { MechanicsService } from './mechanics.service';
import { MechanicProfileService } from './services/mechanic-profile.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [MechanicsController],
  providers: [MechanicsService, MechanicProfileService, PrismaService]
})
export class MechanicsModule {}
