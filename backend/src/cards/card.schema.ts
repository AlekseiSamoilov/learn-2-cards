import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

export type CardDocument = Card & Document;
@Schema()
export class Card {
    @Prop({ required: true })
    frontside: string;

    @Prop({ required: true })
    backside: string;

    @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
    categoryId: Types.ObjectId;

    @Prop({ required: true, default: 0 })
    totalShows: number;

    @Prop({ required: true, default: 0 })
    correctAnswers: number;

    @Prop({ type: String })
    imageUrl: string;

    @Prop({ default: Date.now })
    createdAt: Date;

    @Prop({ default: Date.now })
    updatedAt: Date;
}

export const CardSchema = SchemaFactory.createForClass(Card);

CardSchema.index({ categoryId: 1 })

CardSchema.index({ frontside: 1, categoryId: 1 })