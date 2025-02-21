import { VehicleCategory } from "@shared/enum/VehicleCategory";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("vehicleclasses")
export class VehicleClass {
    
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    displayName!: string;

    @Column()
    model!: string;

    @Column({ type: "enum", enum: VehicleCategory, default: VehicleCategory.CAR })
    category!: VehicleCategory;

    @Column()
    maxFuel!: number;
}