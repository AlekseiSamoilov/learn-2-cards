import { IsString, Max, MaxLength, MinLength } from "class-validator";


export class CreateUserDto {
    @IsString()
    @MinLength(3, { message: 'Username must be at least 3 characters long' })
    @MaxLength(10, { message: 'Username must not exceed 10 characters' })
    login: string;

    @IsString()
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    @MaxLength(10, { message: 'Password must not exceed 10 characters' })
    password: string
}