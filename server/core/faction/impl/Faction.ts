import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Inventory } from "../../inventory/impl/Inventory";
import { Position } from "../../foundation/Position";

@Entity("factions")
export class Faction {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    displayName!: string;

    @Column()
    hexCode!: string;

    @Column()
    maxMembers!: number;

    @Column()
    inventory!: Inventory;

    @Column()
    vehicleColor!: number;

    @Column()
    equipPoint!: Position;
}