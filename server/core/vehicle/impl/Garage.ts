import { Position } from "@shared/types/Position";
import { GarageType } from "@shared/enum/Garage";
import { Collection, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("garages")
export class Garage {
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

    @Column("json", { default: [] })
    parkoutPositions!: Position[];

    @Column({ type: "enum", enum: GarageType, default: GarageType.ALL })
    type!: GarageType;

    @Column()
    blip!: boolean;
}