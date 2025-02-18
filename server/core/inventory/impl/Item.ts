import { Column, Double, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("items")
export class Item {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column({default: 0.25})
    weight!: Double;

    @Column()
    maxStack!: number;

    @Column()
    imagePath!: string;
}