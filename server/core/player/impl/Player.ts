import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Character } from "../../character/impl/Character";
import { Rank } from "../../admin/impl/Rank";
import { notify } from "@server/core/foundation/Utils";

@Entity("player")
export class Player {

    @PrimaryGeneratedColumn()
    id!: number;
    
    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt!: Date;

    @OneToOne(() => Character, { cascade: true, eager: true })
    @JoinColumn()
    character!: Character;

    @Column()
    steamId!: string;

    @Column()
    license!: string;

    @Column("json")
    identifiers!: string[];

    @ManyToOne(() => Rank, { nullable: true, eager: true })
    @JoinColumn()
    rank!: Rank | null;

    @Column({default: 0})
    warns!: number;

    source: number;
    aduty: boolean = false;

    constructor(source: number) {
        this.source = source;
    }

    getPed = () => {
        return GetPlayerPed(this.source.toString());
    }

    kickPlayer = (reason: string = null) => {
        DropPlayer(this.source.toString(), reason);
    }

    notify = (title: string | null, message: string, color: string = "green", delay = 5000) => {
        notify(this, title, message, color, delay);
    }
}