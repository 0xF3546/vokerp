import { Position } from "@shared/types/Position";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("house_basements")
export class HouseBasement {
    
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    label!: string

    @Column()
    price!: number

    @Column("json")
    position!: Position
}