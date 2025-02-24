import { Position } from "@shared/types/Position";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { VehicleShopExitPoint } from "./VehicleShopExitPoint";
import { VehicleShopVehicle } from "./VehicleShopVehicle";
import { VehicleCategory } from "@shared/enum/VehicleCategory";

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

    @Column({default: 225})
    blip!: number;

    @Column({default: 's_m_m_autoshop_01'})
    ped!: string;

    @Column({ type: "enum", enum: VehicleCategory, default: VehicleCategory.CAR })
    type!: VehicleCategory;

    getTypeName() {
        let typeName = "";
        switch (this.type) {
            case VehicleCategory.CAR:
                typeName = "Fahrzeugshop";
                break;
            case VehicleCategory.BIKE:
                typeName = "Motorradshop";
                break;
            case VehicleCategory.TRUCK:
                typeName = "Truckshop";
                break;
            case VehicleCategory.AIRCRAFT:
                typeName = "Flugzeugshop";
                break;
            case VehicleCategory.BOAT:
                typeName = "Bootsshop";
                break;
        }

        return typeName;
    }
}