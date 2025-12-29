import { Injectable, Inject, forwardRef } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateMessageDto } from "./dto/message.dto";
import { BotService } from "../bot/bot.service";

@Injectable()
export class MessagesService {
    constructor(
        private prisma: PrismaService,
        @Inject(forwardRef(() => BotService))
        private botService: BotService
    ) { }

    async findAll() {
        return this.prisma.message.findMany({
            include: {
                sender: { select: { id: true, fullName: true, username: true } },
                _count: { select: { recipients: true } },
            },
            orderBy: { createdAt: "desc" },
        });
    }

    async findUserMessages(userId: number) {
        return this.prisma.userMessage.findMany({
            where: { userId },
            include: {
                message: {
                    include: {
                        sender: { select: { fullName: true } },
                    },
                },
            },
            orderBy: { message: { createdAt: "desc" } },
        });
    }

    async sendToAll(dto: CreateMessageDto) {
        const customers = await this.prisma.user.findMany({
            where: { role: "customer", isActive: true },
            select: { id: true, telegramId: true },
        });

        const message = await this.prisma.message.create({
            data: {
                title: dto.title,
                content: dto.content,
                senderId: dto.senderId,
                isGlobal: true,
                recipients: {
                    create: customers.map((c) => ({ userId: c.id })),
                },
            },
        });

        let telegramSent = 0;
        let telegramFailed = 0;

        if (this.botService) {
            const result = await this.botService.broadcastMessage(dto.title, dto.content);
            telegramSent = result.sent;
            telegramFailed = result.failed;
        }

        return {
            message,
            recipientsCount: customers.length,
            telegramSent,
            telegramFailed,
        };
    }

    async markAsRead(userId: number, messageId: number) {
        return this.prisma.userMessage.update({
            where: {
                userId_messageId: { userId, messageId },
            },
            data: {
                isRead: true,
                readAt: new Date(),
            },
        });
    }

    async getUnreadCount(userId: number) {
        return this.prisma.userMessage.count({
            where: { userId, isRead: false },
        });
    }
}
