import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { VehicleClass } from "./VehicleClass";
import { Position } from "@shared/types/Position";
import vehicleService from "./VehicleService";

@Entity("vehicles")
export class Vehicle {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    private vehicleClassId!: number;

    @Column({ nullable: true })
    charId!: number;

    @Column({ nullable: true })
    factionId!: number;

    @Column("json")
    lastPosition!: Position;

    @Column()
    parked!: boolean;

    @Column({type: "varchar", length: 8, nullable: true})
    licensePlate!: string;

    @Column("double")
    fuel!: number;

    get vehicleClass() {
        return vehicleService.getClassById(this.vehicleClassId);
    }
}