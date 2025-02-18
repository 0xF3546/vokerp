import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Inventory } from "../../inventory/impl/Inventory";
import { Gender } from "../enums/Gender";
import { Position } from "../../foundation/Position";
import { Faction } from "../../faction/impl/Faction";

@Entity("character")
export class Character {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    inventory!: Inventory;

    @Column()
    gender!: Gender;

    @Column()
    firstname!: string;

    @Column()
    lastname!: string;

    @Column()
    birthdate!: Date;

    @Column()
    level!: number;

    @Column()
    minutes!: number;

    @Column()
    hours!: number;

    @Column()
    lastPosition!: Position;

    @Column()
    armour!: number;

    @Column()
    health!: number;

    @Column()
    cash!: number;

    @Column()
    bank!: number;

    @Column()
    faction!: Faction;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    factionJoinDate!: Date;
}