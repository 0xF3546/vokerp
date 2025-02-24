import { Position } from "@shared/types/Position";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("farmingzone_positions")
export class FarmingzonePosition {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    farmingzoneId!: number;
    
    @Column()
    position!: Position;
}