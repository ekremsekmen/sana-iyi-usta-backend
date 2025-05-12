"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MechanicWorkingHoursService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
const crypto_1 = require("crypto");
let MechanicWorkingHoursService = class MechanicWorkingHoursService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createForMechanic(mechanicId, dto) {
        if (Array.isArray(dto)) {
            if (dto.length === 0) {
                return [];
            }
            const modifiedDto = dto.map(item => ({
                ...item,
                mechanic_id: mechanicId
            }));
            return this.create(modifiedDto);
        }
        else {
            const modifiedDto = {
                ...dto,
                mechanic_id: mechanicId
            };
            return this.create(modifiedDto);
        }
    }
    async create(dto) {
        if (Array.isArray(dto)) {
            if (dto.length === 0) {
                return [];
            }
            const mechanicId = dto[0].mechanic_id;
            const hasInconsistentMechanicId = dto.some(item => item.mechanic_id !== mechanicId);
            if (hasInconsistentMechanicId) {
                throw new common_1.BadRequestException('Tüm çalışma saati kayıtları aynı tamirciye ait olmalıdır.');
            }
            try {
                return await this.prisma.$transaction(async (tx) => {
                    const results = await Promise.all(dto.map(item => tx.mechanic_working_hours.upsert({
                        where: {
                            mechanic_id_day_of_week: {
                                mechanic_id: item.mechanic_id,
                                day_of_week: item.day_of_week,
                            },
                        },
                        update: {
                            start_time: item.start_time,
                            end_time: item.end_time,
                            slot_duration: item.slot_duration,
                            is_day_off: item.is_day_off ?? false,
                        },
                        create: {
                            id: (0, crypto_1.randomUUID)(),
                            mechanic_id: item.mechanic_id,
                            day_of_week: item.day_of_week,
                            start_time: item.start_time,
                            end_time: item.end_time,
                            slot_duration: item.slot_duration,
                            is_day_off: item.is_day_off ?? false,
                        },
                    })));
                    return results;
                });
            }
            catch (error) {
                console.error(`Toplu çalışma saati oluşturulurken hata: ${error.message}`, error.stack);
                throw new common_1.InternalServerErrorException('Toplu çalışma saatleri oluşturulurken bir sunucu hatası oluştu.');
            }
        }
        else {
            try {
                return await this.prisma.mechanic_working_hours.upsert({
                    where: {
                        mechanic_id_day_of_week: {
                            mechanic_id: dto.mechanic_id,
                            day_of_week: dto.day_of_week,
                        },
                    },
                    update: {
                        start_time: dto.start_time,
                        end_time: dto.end_time,
                        slot_duration: dto.slot_duration,
                        is_day_off: dto.is_day_off ?? false,
                    },
                    create: {
                        id: (0, crypto_1.randomUUID)(),
                        mechanic_id: dto.mechanic_id,
                        day_of_week: dto.day_of_week,
                        start_time: dto.start_time,
                        end_time: dto.end_time,
                        slot_duration: dto.slot_duration,
                        is_day_off: dto.is_day_off ?? false,
                    },
                });
            }
            catch (error) {
                console.error(`Çalışma saati oluşturulurken hata: ${error.message}`, error.stack);
                throw new common_1.InternalServerErrorException('Çalışma saati oluşturulurken bir sunucu hatası oluştu.');
            }
        }
    }
    async findByMechanic(mechanicId) {
        return this.prisma.mechanic_working_hours.findMany({
            where: { mechanic_id: mechanicId },
            orderBy: { day_of_week: 'asc' },
        });
    }
    async findOne(id) {
        const workingHours = await this.prisma.mechanic_working_hours.findUnique({
            where: { id },
        });
        if (!workingHours) {
            throw new common_1.NotFoundException(`Working hours with id ${id} not found.`);
        }
        return workingHours;
    }
    async update(id, dto) {
        try {
            const updateData = {};
            if (dto.start_time !== undefined)
                updateData.start_time = dto.start_time;
            if (dto.end_time !== undefined)
                updateData.end_time = dto.end_time;
            if (dto.slot_duration !== undefined)
                updateData.slot_duration = dto.slot_duration;
            if (dto.is_day_off !== undefined)
                updateData.is_day_off = dto.is_day_off;
            if (dto.day_of_week !== undefined)
                updateData.day_of_week = dto.day_of_week;
            return await this.prisma.mechanic_working_hours.update({
                where: { id },
                data: updateData,
            });
        }
        catch (error) {
            throw new common_1.NotFoundException(`Working hours with id ${id} not found.`);
        }
    }
    async remove(id) {
        try {
            return await this.prisma.mechanic_working_hours.delete({
                where: { id },
            });
        }
        catch (error) {
            throw new common_1.NotFoundException(`Working hours with id ${id} not found.`);
        }
    }
    async createOrUpdateBulk(mechanicId, dtoList) {
        if (!dtoList || dtoList.length === 0) {
            throw new common_1.BadRequestException('En az bir çalışma saati kaydı belirtilmelidir.');
        }
        try {
            return await this.prisma.$transaction(async (tx) => {
                const results = [];
                for (const dto of dtoList) {
                    dto.mechanic_id = mechanicId;
                    const result = await tx.mechanic_working_hours.upsert({
                        where: {
                            mechanic_id_day_of_week: {
                                mechanic_id: mechanicId,
                                day_of_week: dto.day_of_week,
                            },
                        },
                        update: {
                            start_time: dto.start_time,
                            end_time: dto.end_time,
                            slot_duration: dto.slot_duration,
                            is_day_off: dto.is_day_off ?? false,
                        },
                        create: {
                            id: (0, crypto_1.randomUUID)(),
                            mechanic_id: mechanicId,
                            day_of_week: dto.day_of_week,
                            start_time: dto.start_time,
                            end_time: dto.end_time,
                            slot_duration: dto.slot_duration,
                            is_day_off: dto.is_day_off ?? false,
                        },
                    });
                    results.push(result);
                }
                return results;
            });
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            console.error(`Çalışma saatlerini güncellerken hata: ${error.message}`, error.stack);
            throw new common_1.InternalServerErrorException('Çalışma saatleri güncellenirken bir sunucu hatası oluştu.');
        }
    }
};
exports.MechanicWorkingHoursService = MechanicWorkingHoursService;
exports.MechanicWorkingHoursService = MechanicWorkingHoursService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MechanicWorkingHoursService);
//# sourceMappingURL=mechanic-working-hours.service.js.map