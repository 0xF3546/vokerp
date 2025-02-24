import { Position } from "@shared/types/Position";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { FarmingzonePosition } from "./FarmingzonePosition";

@Entity('farmingzones')
export class FarmingZone {
    positions: FarmingzonePosition[] = [];

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column("json")
    position!: Position;

    @Column({default: 0})
    blip!: number;

    @Column({default: 0})
    blipColor!: number;

    @Column({default: true})
    useBlip!: boolean;

    @Column({default: 3})
    farmRadius!: number;

}