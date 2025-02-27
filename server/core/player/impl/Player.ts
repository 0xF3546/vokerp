import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Character } from "../../character/impl/Character";
import { Rank } from "../../admin/impl/Rank";
import { notify } from "@server/core/foundation/Utils";
import { MAX_VOICE_RANGE } from "@shared/constants/MAX_VOICE_RANGE";
import { GetPlayer } from "@server/core/foundation/GetPlayer";

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
    voiceRange: number = 1;

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

    setVariable = (key: string, value: any) => {
        GetPlayer(this.source).state[key] = value;
    }

    getVariable = (key: string) => {
        return GetPlayer(this.source).state[key];
    }

    isOnline = () => {
        return GetPlayer(this.source) !== null;
    }

    setVoiceRange = (range: number | undefined): number => {
        const initialRange = range || this.voiceRange++;
        if (initialRange > MAX_VOICE_RANGE) {
            this.voiceRange = 0;
        } else {
            this.voiceRange = initialRange;
        }
        return this.voiceRange;
    }

    setDimension = (dimension: number) => {
        SetPlayerRoutingBucket(this.source.toString(), dimension);
    }
    
    getDimension = () => {
        return GetPlayerRoutingBucket(this.source.toString());
    }
}