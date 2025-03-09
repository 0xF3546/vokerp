import { Gender } from "@shared/enum/Gender";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("clothes")
export class Clothe {
    
    @PrimaryGeneratedColumn()
    id!: number

    @Column('longtext')
    label!: string

    @Column()
    price!: number

    @Column()
    component!: number

    @Column()
    drawable!: number

    @Column()
    texture!: number

    @Column()
    dlc!: number

    @Column()
    prop!: number

    @Column()
    shopId!: number;

    @Column({ type: "enum", enum: Gender, default: Gender.MALE })
    gender!: Gender
}