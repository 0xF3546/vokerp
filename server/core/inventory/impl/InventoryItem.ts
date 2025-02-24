import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Item } from "./Item";
import { Inventory } from "./Inventory";
import { InventoryItemDto } from "@shared/models/InventoryItemDto";

@Entity("inventory_items")
export class InventoryItem {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Item)
    item!: Item;

    @Column()
    slot!: number;

    @Column()
    amount!: number;

    @ManyToOne(() => Inventory, inventory => inventory.items)
    inventory!: Inventory;

    getDto(): InventoryItemDto {
        const dto = new InventoryItemDto(
            this.id,
            this.item.getDto(),
            this.slot,
            this.amount
        );
        return dto;
    }
}
