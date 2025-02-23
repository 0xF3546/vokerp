import { Position } from "@shared/types/Position";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("jumppoints")
export class JumpPoint {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column("json")
    enterPoint!: Position;

    @Column("json")
    exitPoint!: Position;

    @Column({ default: null, nullable: true })
    factionId!: number | null;

    @Column({ default: true})
    showMarkerAtFirstPoint!: boolean;

    @Column({ default: true })
    showMarkerAtSecondPoint!: boolean;

    @Column({ default: 3 })
    rangeAtFirstPoint!: number;

    @Column({ default: 3 })
    rangeAtSecondPoint!: number;

    @Column({default: 0})
    dimension!: number;

    @Column({ default: null, nullable: true })
    eventNameOnFirstPoint!: string | null;

    @Column({ default: null, nullable: true })
    eventNameOnSecondPoint!: string | null;
}