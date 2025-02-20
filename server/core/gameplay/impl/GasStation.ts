import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("gasstations")
export class GasStation {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type: "double", default: 0})
    fuel!: number;

    @Column({default: null})
    businessId!: number | null;
}