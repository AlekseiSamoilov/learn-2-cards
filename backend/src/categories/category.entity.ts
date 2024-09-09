import { ObjectId } from "mongodb";
import { Column, CreateDateColumn, Entity, ObjectIdColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Category {
    @ObjectIdColumn()
    id: ObjectId;

    @Column()
    name: string;

    @Column()
    userId: ObjectId;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}