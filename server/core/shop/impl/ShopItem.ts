import { getInventoryService } from "@server/core/inventory/impl/InventoryService";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("shop_items")
export class ShopItem {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    shopId!: number;

    @Column()
    private itemId!: number;

    @Column()
    price!: number;

    get item() {
        return getInventoryService().getItembyId(this.itemId);
    }
};