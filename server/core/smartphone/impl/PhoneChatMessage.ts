import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("phone_chat_messages")
export class PhoneChatMessage {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    chatId!: number;

    @Column('longtext')
    message!: string;

    @Column()
    timestamp!: Date;

    @Column()
    senderId!: number;

    @Column()
    edited: boolean = false;

    @Column({ type: "timestamp", nullable: true, default: null })
    editedTimestamp: Date | null = null;
}