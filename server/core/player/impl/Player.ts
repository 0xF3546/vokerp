import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { IPlayer } from "../IPlayer";
import { Character } from "../../character/impl/Character";

@Entity("player")
export class Player implements IPlayer {

    @PrimaryGeneratedColumn()
    id!: number;
    
    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt!: Date;

    @Column()
    character!: Character;

    @Column()
    steamId!: string;

    @Column()
    license!: string;

    @Column()
    identifiers!: string[];

    source: number;

    constructor(source: number) {
        this.source = source;
    }
}