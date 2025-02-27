import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { VehicleClass } from "./VehicleClass";
import { Position } from "@shared/types/Position";
import vehicleService, { getVehicleService } from "./VehicleService";
import { PositionParser } from "@server/core/foundation/PositionParser";

@Entity("vehicles")
export class Vehicle {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    vehicleClassId!: number;

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

    @Column({ nullable: true, default: null })
    notes!: string;

    @Column({ default: false })
    isFavorite!: boolean;

    @Column()
    garageId!: number;

    entity?: number;

    private _locked;

    get vehicleClass() {
        return getVehicleService().getClassById(this.vehicleClassId);
    }

    get position() {
        if (!this.entity) return this.lastPosition;
        return PositionParser.getPosition(this.entity);
    }

    set locked(value: boolean) {
        SetVehicleDoorsLocked(this.entity, 7);
        this._locked = value;
    }

    get locked() {
        return this._locked;
    }
}