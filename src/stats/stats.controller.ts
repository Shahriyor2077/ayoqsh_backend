import { Controller, Get, Param, Query, ParseIntPipe } from "@nestjs/common";
import { StatsService } from "./stats.service";

@Controller("api/stats")
export class StatsController {
    constructor(private statsService: StatsService) { }

    @Get()
    getOverallStats() {
        return this.statsService.getOverallStats();
    }

    @Get("daily")
    getDailyStats(@Query("days") days?: string) {
        return this.statsService.getDailyStats(days ? parseInt(days) : 30);
    }

    @Get("stations")
    getStationStats() {
        return this.statsService.getStationStats();
    }

    @Get("operator/:id")
    getOperatorStats(@Param("id", ParseIntPipe) id: number) {
        return this.statsService.getOperatorStats(id);
    }

    @Get("customer/:id")
    getCustomerStats(@Param("id", ParseIntPipe) id: number) {
        return this.statsService.getCustomerStats(id);
    }
}
