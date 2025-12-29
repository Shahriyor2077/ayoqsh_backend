import { IsNumber, IsString, IsOptional, Min, Max } from "class-validator";
import { Type } from "class-transformer";

export class CreateCheckDto {
    @IsNumber()
    @Min(0.1, { message: "Miqdor 0.1 dan kam bo'lmasligi kerak" })
    @Max(10000, { message: "Miqdor 10000 dan oshmasligi kerak" })
    @Type(() => Number)
    amountLiters!: number;

    @IsNumber()
    @Type(() => Number)
    operatorId!: number;

    @IsNumber()
    @Type(() => Number)
    stationId!: number;

    @IsString()
    @IsOptional()
    customerName?: string;

    @IsString()
    @IsOptional()
    customerPhone?: string;

    @IsString()
    @IsOptional()
    customerAddress?: string;
}

export class UseCheckDto {
    @IsString()
    code!: string;

    @IsNumber()
    @Type(() => Number)
    customerId!: number;
}
