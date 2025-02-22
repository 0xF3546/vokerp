import { Position } from "@shared/types/Position";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("garage_exitpoints")
export class GarageExitpoint {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column("json")
    position!: Position;

    @Column()
    garageId!: number;

    @Column()
    order!: number;
}
