import { Column, CreateDateColumn, Entity, ObjectId, ObjectIdColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User {
    @ObjectIdColumn()
    id: ObjectId;

    @Column({ unique: true })
    login: string;

    @Column()
    password: string;

    @Column()
    recoveryCode: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}