import { ClotheStoreComponent } from "@shared/types/ClotheStoreComponent";
import { Position } from "@shared/types/Position";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("clothingstores")
export class ClotheShop {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column("json")
    position!: Position;

    @Column()
    name!: string;

    @Column({default: 'ig_abigail'})
    npc!: string;

    @Column({default: 0})
    blipColor!: number;

    @Column({default: 73})
    blip!: number;

    @Column("json")
    components!: ClotheStoreComponent[];
}