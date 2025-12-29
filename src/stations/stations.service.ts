import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateStationDto, UpdateStationDto } from "./dto/station.dto";

@Injectable()
export class StationsService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return this.prisma.station.findMany({
            include: {
                _count: {
                    select: { operators: true, checks: true },
                },
            },
            orderBy: { createdAt: "desc" },
        });
    }

    async findOne(id: number) {
        return this.prisma.station.findUnique({
            where: { id },
            include: {
                operators: {
                    select: { id: true, fullName: true, username: true },
                },
            },
        });
    }

    async create(dto: CreateStationDto) {
        return this.prisma.station.create({ data: dto });
    }

    async update(id: number, dto: UpdateStationDto) {
        return this.prisma.station.update({
            where: { id },
            data: dto,
        });
    }

    async delete(id: number) {
        return this.prisma.station.delete({ where: { id } });
    }

    async getStats(id: number) {
        const [checksCount, totalLiters, operatorsCount] = await Promise.all([
            this.prisma.check.count({ where: { stationId: id } }),
            this.prisma.check.aggregate({
                where: { stationId: id, status: "used" },
                _sum: { amountLiters: true },
            }),
            this.prisma.user.count({ where: { stationId: id, role: "operator" } }),
        ]);

        return {
            checksCount,
            totalLiters: Number(totalLiters._sum.amountLiters || 0),
            operatorsCount,
        };
    }
}
