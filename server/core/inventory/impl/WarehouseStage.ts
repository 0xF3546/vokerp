import { Position } from "@shared/types/Position";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("warehouse_stages")
export class WarehouseStage {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column("json")
    position!: Position;

    @Column({ default: 1 })
    stage: number;

    @Column()
    price: number;
}