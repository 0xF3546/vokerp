import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("items")
export class Item {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column("double", { default: 0.25 })
    weight!: number;

    @Column()
    maxStack!: number;

    @Column()
    imagePath!: string;
}