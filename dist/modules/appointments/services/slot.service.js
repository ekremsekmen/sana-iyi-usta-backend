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
exports.SlotService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
let SlotService = class SlotService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAvailableSlots(dto) {
        const date = new Date(dto.date);
        const dayOfWeek = date.getDay();
        const workingHours = await this.prisma.mechanic_working_hours.findUnique({
            where: {
                mechanic_id_day_of_week: {
                    mechanic_id: dto.mechanic_id,
                    day_of_week: dayOfWeek,
                },
            },
        });
        if (!workingHours || workingHours.is_day_off) {
            return [];
        }
        const [startHour, startMinute] = workingHours.start_time.split(':').map(Number);
        const [endHour, endMinute] = workingHours.end_time.split(':').map(Number);
        const dateOnly = new Date(date);
        dateOnly.setHours(0, 0, 0, 0);
        const timezoneOffset = date.getTimezoneOffset() * 60000;
        const startDateTime = new Date(dateOnly.getTime() + (startHour * 3600000 + startMinute * 60000) - timezoneOffset);
        const endDateTime = new Date(dateOnly.getTime() + (endHour * 3600000 + endMinute * 60000) - timezoneOffset);
        const slotDuration = workingHours.slot_duration;
        const slots = [];
        let currentSlotStart = new Date(startDateTime);
        while (currentSlotStart.getTime() + slotDuration * 60 * 1000 <= endDateTime.getTime()) {
            const slotEnd = new Date(currentSlotStart.getTime() + slotDuration * 60 * 1000);
            slots.push({
                start_time: new Date(currentSlotStart),
                end_time: slotEnd,
                available: true,
            });
            currentSlotStart = slotEnd;
        }
        const existingAppointments = await this.prisma.appointments.findMany({
            where: {
                mechanic_id: dto.mechanic_id,
                start_time: {
                    gte: startDateTime,
                },
                end_time: {
                    lte: endDateTime,
                },
            },
        });
        existingAppointments.forEach(appointment => {
            for (const slot of slots) {
                if ((slot.start_time <= appointment.start_time && slot.end_time > appointment.start_time) ||
                    (slot.start_time >= appointment.start_time && slot.start_time < appointment.end_time)) {
                    slot.available = false;
                }
            }
        });
        return slots;
    }
    async isTimeSlotAvailable(mechanicId, startTime, endTime) {
        const overlappingAppointments = await this.prisma.appointments.findFirst({
            where: {
                mechanic_id: mechanicId,
                OR: [
                    {
                        start_time: {
                            lte: startTime,
                        },
                        end_time: {
                            gt: startTime,
                        },
                    },
                    {
                        start_time: {
                            lt: endTime,
                        },
                        end_time: {
                            gte: endTime,
                        },
                    },
                    {
                        start_time: {
                            gte: startTime,
                        },
                        end_time: {
                            lte: endTime,
                        },
                    },
                ],
            },
        });
        return !overlappingAppointments;
    }
};
exports.SlotService = SlotService;
exports.SlotService = SlotService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SlotService);
//# sourceMappingURL=slot.service.js.map