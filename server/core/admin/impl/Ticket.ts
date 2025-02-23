import { Player } from "@server/core/player/impl/Player";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("tickets")
export class Ticket {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    playerId!: number;

    @Column()
    message!: string;

    player: Player | null = null;
}