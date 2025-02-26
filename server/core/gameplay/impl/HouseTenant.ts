import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("house_tenants")
export class HouseTenant {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    houseId!: number;

    @Column()
    characterId!: number;

    @Column()
    rent!: number;
}