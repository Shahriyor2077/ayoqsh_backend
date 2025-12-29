import { Controller, Post, Get, Body, UseGuards, Request } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { Public, CurrentUser } from "./decorators";

@Controller("api/auth")
export class AuthController {
    constructor(private authService: AuthService) { }

    @Public()
    @Post("login")
    async login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }

    @UseGuards(JwtAuthGuard)
    @Get("me")
    async me(@CurrentUser() user: any) {
        return this.authService.me(user.id);
    }

    @Public()
    @Post("logout")
    async logout() {
        return { message: "Logged out" };
    }
}
