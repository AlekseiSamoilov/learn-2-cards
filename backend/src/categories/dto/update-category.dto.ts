import { PartialType } from "@nestjs/swagger";
import { CreateCategoryDto } from "./create-categoty.dto";

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) { }