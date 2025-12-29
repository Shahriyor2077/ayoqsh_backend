import { IsString, IsNumber } from "class-validator";
import { Type } from "class-transformer";

export class CreateMessageDto {
    @IsString()
    title!: string;

    @IsString()
    content!: string;

    @IsNumber()
    @Type(() => Number)
    senderId!: number;
}
