import { Body, Controller, Post } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController{
    constructor(private readonly authService: AuthService){}

    @Post()
    create(@Body() createUserDto: CreateUserDto){
        return this.authService.create(createUserDto);
    }
}