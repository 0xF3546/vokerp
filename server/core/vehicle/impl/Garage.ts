import { Position } from "@shared/types/Position";
import { GarageType } from "@shared/enum/Garage";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { GarageExitpoint } from "./GarageExitpoint";

@Entity("garages")
export class Garage {
    public exitPoints: GarageExitpoint[] = [];

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({nullable: true, default: null})
    factionId!: number;

    @Column()
    name!: string;

    @Column()
    npc!: string;

    @Column("json")
    position!: Position;

    @Column({ type: "enum", enum: GarageType, default: GarageType.ALL })
    type!: GarageType;

    @Column({default: true})
    blip!: boolean;
}