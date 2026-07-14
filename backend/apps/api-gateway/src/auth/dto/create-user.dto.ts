import {IsEmail, IsNotEmpty, IsString} from "class-validator"

export class CreateUserDto{
    @IsString()
    @IsNotEmpty()
    first_name!: string

    @IsString()
    last_name?: string

    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email!: string

    @IsString()
    @IsNotEmpty()
    password!: string

    @IsString()
    @IsNotEmpty()
    username!: string
}