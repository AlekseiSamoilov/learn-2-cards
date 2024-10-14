import { IsString } from "class-validator";
import { Types } from "mongoose";

export class CreateCategoryDto {
    @IsString()
    name: string;
} 