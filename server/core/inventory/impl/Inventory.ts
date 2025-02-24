import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { InventoryItem } from "./InventoryItem";
import { dataSource } from "@server/data/database/app-data-source";
import { InventoryDto } from "@shared/models/InventoryDto";

@Entity("inventories") // Sollte plural sein
export class Inventory {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    maxSlots!: number;

    @Column()
    maxWeight!: number;

    @OneToMany(() => InventoryItem, inventoryItem => inventoryItem.inventory)
    items!: InventoryItem[];

    addItem(item: InventoryItem) {
        if (this.getFreeSlots() < this.maxSlots && this.getWeight() + item.item.weight <= this.maxWeight) {
            this.items.push(item);
        }
    }

    removeItem(itemId: number) {
        this.items = this.items.filter(item => item.id !== itemId);
    }

    updateItem(itemId: number, newItem: InventoryItem) {
        const index = this.items.findIndex(item => item.id === itemId);
        if (index !== -1) {
            this.items[index] = newItem;
        }
    }

    getItem(itemId: number) {
        return this.items.find(item => item.id === itemId);
    }

    getItems() {
        return this.items;
    }

    getWeight() {
        return this.items.reduce((totalWeight, item) => totalWeight + item.item.weight, 0);
    }

    getSlots() {
        return this.items.length;
    }

    getFreeSlots() {
        return this.maxSlots - this.items.length;
    }

    getFreeWeight() {
        return this.maxWeight - this.getWeight();
    }

    isFull() {
        return this.items.length >= this.maxSlots || this.getWeight() >= this.maxWeight;
    }

    isEmpty() {
        return this.items.length === 0;
    }

    hasItem(itemId: number) {
        return this.items.some(item => item.id === itemId);
    }

    getDto(): InventoryDto {
        const dto = new InventoryDto(this.name, this.maxSlots, this.maxWeight);
        dto.items = this.items.map(item => item.getDto());
        return dto;
    }
}
