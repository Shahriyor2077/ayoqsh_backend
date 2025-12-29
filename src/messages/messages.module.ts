import { Module, forwardRef } from "@nestjs/common";
import { MessagesService } from "./messages.service";
import { MessagesController } from "./messages.controller";
import { PrismaModule } from "../prisma/prisma.module";
import { BotModule } from "../bot/bot.module";

@Module({
    imports: [PrismaModule, forwardRef(() => BotModule)],
    controllers: [MessagesController],
    providers: [MessagesService],
    exports: [MessagesService],
})
export class MessagesModule { }
