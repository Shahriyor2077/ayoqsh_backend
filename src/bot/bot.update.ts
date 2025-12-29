import { Update, Ctx, Start, Hears, On, Message } from "nestjs-telegraf";
import { Context, Markup } from "telegraf";
import { BotService } from "./bot.service";

interface SessionContext extends Context {
    session?: {
        step?: "awaiting_phone" | "awaiting_code" | "main_menu";
    };
}

@Update()
export class BotUpdate {
    constructor(private botService: BotService) { }

    private mainMenu = Markup.keyboard([
        ["📱 Chek kiritish"],
        ["👤 Mening profilim"],
        ["📊 Statistika"],
        ["ℹ️ Yordam"],
    ]).resize();

    private backMenu = Markup.keyboard([["🔙 Orqaga"]]).resize();

    private phoneMenu = Markup.keyboard([
        [Markup.button.contactRequest("📞 Telefon raqamni yuborish")],
    ]).resize().oneTime();

    @Start()
    async onStart(@Ctx() ctx: SessionContext) {
        const telegramId = ctx.from?.id.toString();
        if (!telegramId) {
            await ctx.reply("Xatolik yuz berdi.");
            return;
        }

        const payload = (ctx as any).startPayload;
        const user = await this.botService.findUserByTelegramId(telegramId);

        if (!user) {
            if (payload && payload.startsWith("check_")) {
                await ctx.reply(
                    "🎉 *AYoQSH Loyiha botiga xush kelibsiz!*\n\n⚠️ Chekni ishlatish uchun avval ro'yxatdan o'ting.\n\nTelefon raqamingizni yuboring:",
                    { parse_mode: "Markdown", reply_markup: this.phoneMenu.reply_markup }
                );
                return;
            }
            await ctx.reply(
                "🎉 *AYoQSH Loyiha botiga xush kelibsiz!*\n\nRo'yxatdan o'tish uchun telefon raqamingizni yuboring.",
                { parse_mode: "Markdown", reply_markup: this.phoneMenu.reply_markup }
            );
            return;
        }

        if (payload && payload.startsWith("check_")) {
            const checkCode = payload.replace("check_", "");
            await ctx.reply("⏳ Chek tekshirilmoqda...");
            await this.processCheckCode(ctx, user, checkCode);
            return;
        }

        await ctx.reply(
            `👋 *Xush kelibsiz, ${user.fullName || "Mijoz"}!*\n\n💧 Balans: *${user.balanceLiters} litr*`,
            { parse_mode: "Markdown", reply_markup: this.mainMenu.reply_markup }
        );
    }

    @On("contact")
    async onContact(@Ctx() ctx: SessionContext, @Message() msg: any) {
        const telegramId = ctx.from?.id.toString();
        const phone = msg.contact?.phone_number;
        const fullName = [ctx.from?.first_name, ctx.from?.last_name].filter(Boolean).join(" ");
        const telegramUsername = ctx.from?.username;

        if (!telegramId || !phone) return;

        const existingUser = await this.botService.findUserByTelegramId(telegramId);
        if (existingUser) {
            await ctx.reply("Siz allaqachon ro'yxatdan o'tgansiz!", { reply_markup: this.mainMenu.reply_markup });
            return;
        }

        const existingByPhone = await this.botService.findUserByPhone(phone);
        if (existingByPhone && existingByPhone.telegramId !== telegramId) {
            await ctx.reply("❌ Bu telefon raqam boshqa hisobga biriktirilgan.");
            return;
        }

        const user = await this.botService.createUser({
            telegramId,
            telegramUsername,
            fullName,
            phone,
        });

        await ctx.reply(
            `✅ *Ro'yxatdan o'tdingiz!*\n\n👤 ${user.fullName}\n📞 ${user.phone}\n💧 Balans: 0 litr`,
            { parse_mode: "Markdown", reply_markup: this.mainMenu.reply_markup }
        );
    }

    @Hears("📱 Chek kiritish")
    async onCheckInput(@Ctx() ctx: SessionContext) {
        await ctx.reply("🔢 *Chek kodini kiriting:*", {
            parse_mode: "Markdown",
            reply_markup: this.backMenu.reply_markup,
        });
    }

    @Hears("👤 Mening profilim")
    async onProfile(@Ctx() ctx: SessionContext) {
        const telegramId = ctx.from?.id.toString();
        if (!telegramId) return;

        const user = await this.botService.getUserProfile(telegramId);
        if (!user) {
            await ctx.reply("Iltimos, /start buyrug'ini yuboring.");
            return;
        }

        await ctx.reply(
            `👤 *Profil*\n\n📛 ${user.fullName || "Noma'lum"}\n📞 ${user.phone || "-"}\n💧 *${user.balanceLiters} litr*\n📝 ${user.checksCount} chek`,
            { parse_mode: "Markdown", reply_markup: this.mainMenu.reply_markup }
        );
    }

    @Hears("📊 Statistika")
    async onStats(@Ctx() ctx: SessionContext) {
        const telegramId = ctx.from?.id.toString();
        if (!telegramId) return;

        const stats = await this.botService.getUserStats(telegramId);
        if (!stats) {
            await ctx.reply("Iltimos, /start buyrug'ini yuboring.");
            return;
        }

        await ctx.reply(
            `📊 *Statistika*\n\n📅 Bu oy: ${stats.monthlyChecks} chek, ${stats.monthlyLiters} L\n💧 Balans: *${stats.balance} litr*`,
            { parse_mode: "Markdown", reply_markup: this.mainMenu.reply_markup }
        );
    }

    @Hears("ℹ️ Yordam")
    async onHelp(@Ctx() ctx: SessionContext) {
        await ctx.reply(
            "ℹ️ *Yordam*\n\n📱 Chek kiritish - Kod kiritib litr yig'ing\n👤 Profil - Balans ko'ring\n📊 Statistika - Oylik ma'lumotlar",
            { parse_mode: "Markdown", reply_markup: this.mainMenu.reply_markup }
        );
    }

    @Hears("🔙 Orqaga")
    async onBack(@Ctx() ctx: SessionContext) {
        await ctx.reply("Asosiy menyu:", { reply_markup: this.mainMenu.reply_markup });
    }

    @On("text")
    async onText(@Ctx() ctx: SessionContext, @Message() msg: any) {
        const text = msg.text;
        if (!text || text.startsWith("/") || text.startsWith("📱") || text.startsWith("👤") || text.startsWith("📊") || text.startsWith("ℹ️") || text.startsWith("🔙")) {
            return;
        }

        const telegramId = ctx.from?.id.toString();
        if (!telegramId) return;

        const user = await this.botService.findUserByTelegramId(telegramId);
        if (!user) {
            await ctx.reply("Iltimos, /start buyrug'ini yuboring.");
            return;
        }

        await this.processCheckCode(ctx, user, text);
    }

    private async processCheckCode(ctx: Context, user: any, code: string): Promise<void> {
        const result = await this.botService.useCheck(code.toUpperCase().trim(), user.id);

        if (!result.success) {
            await ctx.reply(`❌ *${result.message}*`, { parse_mode: "Markdown" });
            return;
        }

        await ctx.reply(
            `✅ *Chek qabul qilindi!*\n\n💧 +${result.amount} litr\n🏪 ${result.stationName}\n💰 Balans: *${result.newBalance} litr*`,
            { parse_mode: "Markdown", reply_markup: this.mainMenu.reply_markup }
        );
    }
}
