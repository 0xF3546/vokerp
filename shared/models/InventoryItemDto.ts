import { ItemDto } from "./ItemDto";

export class InventoryItemDto {
        id!: number;
        item!: ItemDto;    
        slot!: number;
        amount!: number;

        constructor(id: number, item: ItemDto, slot: number, amount: number) {
            this.id = id;
            this.item = item;
            this.slot = slot;
            this.amount = amount
        }
}