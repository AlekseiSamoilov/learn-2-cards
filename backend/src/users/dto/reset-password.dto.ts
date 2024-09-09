import { IsString, Length, MinLength } from "class-validator";

export class ResetPasswordDto {
    @IsString()
    login: string;

    @IsString()
    @Length(6, 6)
    recoveryCode: string;

    @IsString()
    @MinLength(6)
    newPassword: string;
}