import { Position } from "@shared/types/Position";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("vehicleshop_exitpoints")
export class VehicleShopExitPoint {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    shopId!: number;

    @Column("json")
    position!: Position;

    @Column()
    order!: number;
}