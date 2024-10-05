import { IsNotEmpty, IsString } from "class-validator";
import { ObjectId } from "mongodb";

export class CreateCardDto {
    @IsString()
    @IsNotEmpty()
    frontSide: string;

    @IsString()
    @IsNotEmpty()
    backSide: string;

    @IsNotEmpty()
    categoryId: ObjectId;

    @IsNotEmpty()
    userId: ObjectId;
}