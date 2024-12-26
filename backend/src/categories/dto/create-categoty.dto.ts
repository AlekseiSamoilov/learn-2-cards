import { IsString, MaxLength, MinLength } from "class-validator";

export class CreateCategoryDto {
    @IsString()
    @MinLength(2)
    @MaxLength(25)
    title: string;
} 