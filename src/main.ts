import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
    app.enableCors();

    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`🚀 NestJS server running on http://localhost:${port}`);
}

bootstrap().catch((err) => {
    console.error("❌ Server xatosi:", err.message);
    // Bot xatosi bo'lsa ham server ishlashda davom etsin
    if (err.message?.includes("409") || err.message?.includes("Conflict")) {
        console.warn("⚠️ Telegram bot boshqa joyda ishlayapti. Bot o'chirildi, server davom etmoqda.");
    }
});
