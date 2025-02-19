import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { VehicleClass } from "./VehicleClass";

@Entity("vehicles")
export class Vehicle {

    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => VehicleClass)
    @JoinColumn()
    vehicleClass!: VehicleClass;
}