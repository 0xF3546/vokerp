import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Character } from "../../character/impl/Character";
import { Rank } from "../../admin/impl/Rank";

@Entity("player")
export class Player {

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

    @Column()
    rank!: Rank;

    source: number;

    constructor(source: number) {
        this.source = source;
    }
}