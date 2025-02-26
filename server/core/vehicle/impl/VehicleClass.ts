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
    width!: number;

    @Column()
    slots!: number;

    @Column({default: null, nullable: true})
    info!: string | null;

    @Column({default: null, nullable: true})
    livery!: number | null;

    @Column({default: null, nullable: true})
    extras!: string | null;

    @Column()
    maxFuel!: number;
}