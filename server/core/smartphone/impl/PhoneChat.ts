import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PhoneChatMessage } from "./PhoneChatMessage";

@Entity("smartphone_chats")
export class PhoneChat {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column("json")
    participant!: number[];

    @Column({ type: "varchar", length: 255, nullable: true, default: null })
    title!: string | null;

    @OneToMany(() => PhoneChatMessage, message => message.chatId)
    @JoinColumn()
    messages!: PhoneChatMessage[];
}