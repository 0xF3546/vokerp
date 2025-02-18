import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("ranks")
export class Rank {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    displayName!: string;

    @Column()
    hexCode!: string;

    @Column()
    clotheId!: number;
}