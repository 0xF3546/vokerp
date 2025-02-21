import { Position } from "@shared/types/Position";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("house_interiors")
export class HouseInterior {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column("json")
    position!: Position;

    @Column()
    label!: string;

    @Column()
    price!: number;
}