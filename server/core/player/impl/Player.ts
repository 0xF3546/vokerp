import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Character } from "../../character/impl/Character";
import { Rank } from "../../admin/impl/Rank";

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

    constructor(source: number) {
        this.source = source;
    }

    kickPlayer = (reason: string = null) => {
        DropPlayer(this.source.toString(), reason);
    }
}