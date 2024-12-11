import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type UserDocument = User & Document;
@Schema()
export class User {
    _id: Types.ObjectId;

    @Prop({ required: true, unique: true })
    login: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true })
    recoveryCode: string;

    @Prop({ default: '' })
    displayName: string;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Category' }] })

    @Prop({ default: Date.now })
    createdAt: Date;

    @Prop({ default: Date.now })
    updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ login: 1 });