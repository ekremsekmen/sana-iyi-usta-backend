import { Injectable } from '@nestjs/common';
import { MechanicProfileService } from './services/mechanic-profile.service';
import { CreateMechanicDto } from './dto/create-mechanic.dto';
import { UpdateMechanicDto } from './dto/update-mechanic.dto';

@Injectable()
export class MechanicsService {
  constructor(private readonly mechanicProfileService: MechanicProfileService) {}

  create(createMechanicDto: CreateMechanicDto) {
    return this.mechanicProfileService.create(createMechanicDto);
  }

  findOne(id: string) {
    return this.mechanicProfileService.findOne(id);
  }

  update(id: string, updateMechanicDto: UpdateMechanicDto) {
    return this.mechanicProfileService.update(id, updateMechanicDto);
  }

  remove(id: string) {
    return this.mechanicProfileService.remove(id);
  }
}
