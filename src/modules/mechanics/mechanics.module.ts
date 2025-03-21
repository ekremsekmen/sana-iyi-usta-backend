import { Module } from '@nestjs/common';
import { MechanicsController } from './mechanics.controller';
import { MechanicsService } from './mechanics.service';

@Module({
  controllers: [MechanicsController],
  providers: [MechanicsService]
})
export class MechanicsModule {}
