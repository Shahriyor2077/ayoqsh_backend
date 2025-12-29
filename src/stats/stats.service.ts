import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class StatsService {
    constructor(private prisma: PrismaService) { }

    async getOverallStats() {
        const [
            totalCustomers,
            totalOperators,
            totalStations,
            totalChecks,
            usedChecks,
            pendingChecks,
            usedLiters,
            pendingLiters,
        ] = await Promise.all([
            this.prisma.user.count({ where: { role: "customer" } }),
            this.prisma.user.count({ where: { role: "operator" } }),
            this.prisma.station.count({ where: { isActive: true } }),
            this.prisma.check.count(),
            this.prisma.check.count({ where: { status: "used" } }),
            this.prisma.check.count({ where: { status: "pending" } }),
            this.prisma.check.aggregate({
                where: { status: "used" },
                _sum: { amountLiters: true },
            }),
            this.prisma.check.aggregate({
                where: { status: "pending" },
                _sum: { amountLiters: true },
            }),
        ]);

        return {
            totalCustomers,
            totalOperators,
            totalStations,
            totalChecks,
            usedChecks,
            pendingChecks,
            usedLiters: Number(usedLiters._sum.amountLiters || 0),
            pendingLiters: Number(pendingLiters._sum.amountLiters || 0),
            totalLiters: Number(usedLiters._sum.amountLiters || 0) + Number(pendingLiters._sum.amountLiters || 0),
        };
    }

    async getDailyStats(days: number = 30) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const checks = await this.prisma.check.groupBy({
            by: ["createdAt"],
            where: {
                createdAt: { gte: startDate },
            },
            _sum: { amountLiters: true },
            _count: true,
        });

        return checks;
    }

    async getStationStats() {
        return this.prisma.station.findMany({
            select: {
                id: true,
                name: true,
                _count: {
                    select: {
                        checks: true,
                        operators: true,
                    },
                },
            },
        });
    }

    async getOperatorStats(operatorId: number) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const thisMonth = new Date();
        thisMonth.setDate(1);
        thisMonth.setHours(0, 0, 0, 0);

        const [todayStats, monthStats, totalStats] = await Promise.all([
            this.prisma.check.aggregate({
                where: { operatorId, createdAt: { gte: today } },
                _sum: { amountLiters: true },
                _count: true,
            }),
            this.prisma.check.aggregate({
                where: { operatorId, createdAt: { gte: thisMonth } },
                _sum: { amountLiters: true },
                _count: true,
            }),
            this.prisma.check.aggregate({
                where: { operatorId },
                _sum: { amountLiters: true },
                _count: true,
            }),
        ]);

        return {
            today: {
                checks: todayStats._count,
                liters: Number(todayStats._sum.amountLiters || 0),
            },
            month: {
                checks: monthStats._count,
                liters: Number(monthStats._sum.amountLiters || 0),
            },
            total: {
                checks: totalStats._count,
                liters: Number(totalStats._sum.amountLiters || 0),
            },
        };
    }

    async getCustomerStats(customerId: number) {
        const user = await this.prisma.user.findUnique({
            where: { id: customerId },
            select: {
                balanceLiters: true,
                createdAt: true,
                _count: {
                    select: { usedChecks: true },
                },
            },
        });

        if (!user) return null;

        const rank = await this.prisma.user.count({
            where: {
                role: "customer",
                balanceLiters: { gt: user.balanceLiters },
            },
        });

        return {
            balanceLiters: Number(user.balanceLiters),
            totalChecks: user._count.usedChecks,
            rank: rank + 1,
            memberSince: user.createdAt,
        };
    }
}
