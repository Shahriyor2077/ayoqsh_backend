import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from "@nestjs/common";
import { StationsService } from "./stations.service";
import { CreateStationDto, UpdateStationDto } from "./dto/station.dto";

@Controller("api/stations")
export class StationsController {
    constructor(private stationsService: StationsService) { }

    @Get()
    findAll() {
        return this.stationsService.findAll();
    }

    @Get(":id")
    findOne(@Param("id", ParseIntPipe) id: number) {
        return this.stationsService.findOne(id);
    }

    @Get(":id/stats")
    getStats(@Param("id", ParseIntPipe) id: number) {
        return this.stationsService.getStats(id);
    }

    @Post()
    create(@Body() dto: CreateStationDto) {
        return this.stationsService.create(dto);
    }

    @Put(":id")
    update(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdateStationDto) {
        return this.stationsService.update(id, dto);
    }

    @Delete(":id")
    delete(@Param("id", ParseIntPipe) id: number) {
        return this.stationsService.delete(id);
    }
}
