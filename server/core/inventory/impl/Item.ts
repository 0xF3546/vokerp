import { ItemDto } from "@shared/models/ItemDto";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("items")
export class Item {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    displayName!: string;

    @Column("double", { default: 0.25 })
    weight!: number;

    @Column()
    maxStack!: number;

    @Column()
    imagePath!: string;

    getDto(): ItemDto {
        const dto = new ItemDto(
            this.id,
            this.name,
            this.weight,
            this.maxStack,
            this.imagePath,
            this.displayName)
        return dto;
    }
}