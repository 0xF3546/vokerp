import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Item } from "./Item";
import { Inventory } from "./Inventory";

@Entity("inventory_items")
export class InventoryItem {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Item)
    item!: Item;

    @ManyToOne(() => Inventory, inventory => inventory.items)
    inventory!: Inventory;
}
