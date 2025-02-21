import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Player } from "./Player";

@Entity("player_bans")
export class PlayerBan {
    @PrimaryGeneratedColumn()
    id!: number;

    @OneToOne(() => Player)
    @JoinColumn()
    player!: Player;

    @OneToOne(() => Player)
    @JoinColumn()
    punisher!: Player;

    @Column()
    reason!: string;

    @Column()
    isPermanent!: boolean;

    @Column()
    expirationDate!: Date;
}