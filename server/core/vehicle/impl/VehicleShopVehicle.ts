import { Position } from "@shared/types/Position";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("vehicleshop_vehicles")
export class VehicleShopVehicle {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    shopId!: number;

    @Column()
    vehicleClass!: number;

    @Column()
    price!: number;

    @Column()
    position!: Position;

    @Column({default: -1})
    available!: number;
}