import { Position } from "@shared/types/Position";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("processors")
export class Processor {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column("json")
    position!: Position;

    @Column({default: 0})
    inputItemId!: number;

    @Column({default: 0})
    outputItemId!: number;

    @Column({default: 0})
    inputAmount!: number;

    @Column({default: 0})
    outputAmount!: number;

    @Column({default: 0})
    processTime!: number;

    @Column({default: 'a_m_m_eastsa_02'})
    npc!: string;
}