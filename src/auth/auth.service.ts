import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../prisma/prisma.service";
import { LoginDto } from "./dto/login.dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService
    ) { }

    async validateUser(username: string, password: string) {
        const user = await this.prisma.user.findUnique({
            where: { username },
            include: { station: { select: { id: true, name: true } } },
        });

        if (!user || !user.password) {
            return null;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return null;
        }

        return user;
    }

    async login(dto: LoginDto) {
        const user = await this.validateUser(dto.username, dto.password);

        if (!user) {
            throw new UnauthorizedException("Foydalanuvchi nomi yoki parol noto'g'ri");
        }

        if (!user.isActive) {
            throw new UnauthorizedException("Hisobingiz faol emas");
        }

        const payload = { sub: user.id, username: user.username, role: user.role };
        const accessToken = this.jwtService.sign(payload);

        const { password, ...userWithoutPassword } = user;

        return {
            user: userWithoutPassword,
            accessToken,
        };
    }

    async me(userId: number) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { station: { select: { id: true, name: true } } },
        });

        if (!user) return null;

        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, 10);
    }
}
