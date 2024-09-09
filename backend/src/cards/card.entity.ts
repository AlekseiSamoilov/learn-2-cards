import { ObjectId } from "mongodb";
import { Column, CreateDateColumn, Entity, ObjectIdColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Card {

    @ObjectIdColumn()
    id: ObjectId;

    @Column()
    frontSide: string;

    @Column()
    backside: string;

    @Column()
    categoryId: ObjectId;

    @Column()
    userId: ObjectId;

    @Column({ default: 0 })
    totalShows: number;

    @Column({ default: 0 })
    correctAnswers: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}