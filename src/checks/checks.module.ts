import { Module } from "@nestjs/common";
import { ChecksService } from "./checks.service";
import { ChecksController } from "./checks.controller";
import { QrService } from "./qr.service";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
    imports: [PrismaModule],
    controllers: [ChecksController],
    providers: [ChecksService, QrService],
    exports: [ChecksService, QrService],
})
export class ChecksModule { }
