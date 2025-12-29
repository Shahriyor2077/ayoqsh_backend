import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { StationsModule } from "./stations/stations.module";
import { ChecksModule } from "./checks/checks.module";
import { MessagesModule } from "./messages/messages.module";
import { StatsModule } from "./stats/stats.module";
import { BotModule } from "./bot/bot.module";

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        PrismaModule,
        AuthModule,
        UsersModule,
        StationsModule,
        ChecksModule,
        MessagesModule,
        StatsModule,
        BotModule,
    ],
})
export class AppModule { }
