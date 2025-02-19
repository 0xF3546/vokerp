import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("vehicleclasses")
export class VehicleClass {
    
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    maxFuel!: number;
}