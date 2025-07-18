import { ShopType } from "@shared/enum/ShopType";
import { Position } from "@shared/types/Position";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ShopItem } from "./ShopItem";

@Entity("shops")
export class Shop {
    items: ShopItem[] = [];
    @PrimaryGeneratedColumn()
    id!: number;

    @Column("json")
    position!: Position;

    @Column()
    name!: string;

    @Column({default: 'mp_m_shopkeep_01'})
    npc!: string;

    @Column({type: 'enum', enum: ShopType, default: ShopType.SUPERMARKET})
    type!: ShopType;
}