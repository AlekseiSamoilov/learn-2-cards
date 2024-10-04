import { IsNotEmpty, IsString } from "class-validator";
import { ObjectId } from "mongodb";

export class CreateCardDto {
    @IsString()
    @IsNotEmpty()
    frontSide: string;

    @IsString()
    @IsNotEmpty()
    backside: string;

    @IsNotEmpty()
    categoryId: ObjectId;

    @IsNotEmpty()
    userId: ObjectId;
}