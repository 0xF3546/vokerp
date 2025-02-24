import { InventoryItemDto } from "./InventoryItemDto";

export class InventoryDto {
    name!: string;
    maxSlots!: number;
    maxWeight!: number;

    items: InventoryItemDto[] = [];

    constructor(name: string, maxSlots: number, maxWeight: number) {
        this.name = name;
        this.maxSlots = maxSlots;
        this.maxWeight = maxWeight;
    }
}