import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
    console.log("Ma'lumotlar bazasi to'ldirilmoqda...");

    const moderatorPassword = await bcrypt.hash("admin123", 10);

    await prisma.userMessage.deleteMany();
    await prisma.message.deleteMany();
    await prisma.check.deleteMany();
    await prisma.user.deleteMany();
    await prisma.station.deleteMany();

    await prisma.user.create({
        data: {
            username: "admin",
            password: moderatorPassword,
            fullName: "Administrator",
            role: "moderator",
        },
    });

    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 1);


    console.log("✅ Ma'lumotlar bazasi to'ldirildi!");
    console.log("\n📋 Administrator hisobi:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("Login:  admin");
    console.log("Parol:  admin123");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("\n💡 Operatorlar va shaxobchalarni admin paneldan yarating.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
