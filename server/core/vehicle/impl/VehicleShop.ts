import { Position } from "@shared/types/Position";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { VehicleShopExitPoint } from "./VehicleShopExitPoint";
import { VehicleShopVehicle } from "./VehicleShopVehicle";

@Entity("vehicleshops")
export class VehicleShop {
    exitPoints: VehicleShopExitPoint[] = [];
    vehicles: VehicleShopVehicle[] = [];

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column("json")
    position!: Position;

    @Column()
    garageId!: number;

    @Column()
    blip!: number;

    @Column({default: 's_m_m_autoshop_01'})
    ped!: string;
}