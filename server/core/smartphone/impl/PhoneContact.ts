import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("smartphone_chats")
export class PhoneContact {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    number!: string;

    @Column()
    charId!: number;

    @Column()
    pinned: boolean = false;
}