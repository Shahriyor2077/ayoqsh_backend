import { Controller, Get, Post, Put, Body, Param, ParseIntPipe } from "@nestjs/common";
import { MessagesService } from "./messages.service";
import { CreateMessageDto } from "./dto/message.dto";

@Controller("api/messages")
export class MessagesController {
    constructor(private messagesService: MessagesService) { }

    @Get()
    findAll() {
        return this.messagesService.findAll();
    }

    @Get("user/:userId")
    findUserMessages(@Param("userId", ParseIntPipe) userId: number) {
        return this.messagesService.findUserMessages(userId);
    }

    @Get("user/:userId/unread")
    getUnreadCount(@Param("userId", ParseIntPipe) userId: number) {
        return this.messagesService.getUnreadCount(userId);
    }

    @Post("send-all")
    sendToAll(@Body() dto: CreateMessageDto) {
        return this.messagesService.sendToAll(dto);
    }

    @Put(":messageId/read/:userId")
    markAsRead(
        @Param("messageId", ParseIntPipe) messageId: number,
        @Param("userId", ParseIntPipe) userId: number
    ) {
        return this.messagesService.markAsRead(userId, messageId);
    }
}
