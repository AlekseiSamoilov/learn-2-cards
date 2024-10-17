import { IsMongoId, IsOptional, IsString, IsUrl, MinLength } from "class-validator";
import { measureMemory } from "vm";

export class CreateCardDto {
    @IsString()
    @MinLength(1, { message: 'Frontside must not be empty' })
    frontside: string;

    @IsString()
    @MinLength(1, { message: 'Backside must not be empty' })
    backside: string;

    @IsMongoId()
    categoryId: string;

    @IsOptional()
    @IsUrl({}, { message: 'Invalid URL for image' })
    imageUrl?: string;
}