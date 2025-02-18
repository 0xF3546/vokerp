import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { Item } from "./Item";

@Entity("inventorys")
export class Inventory {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    maxSlots!: number;

    @Column()
    maxWeight!: number;

    @Column()
    imagePath!: string;

    @Column()
    items!: Item[];

    addItem() {
        // TODO
    }

    removeItem() {
        // TODO
    }

    updateItem() {
        // TODO
    }

    getItem() {
        // TODO
    }

    getItems() {
        // TODO
    }

    getWeight() {
        // TODO
    }

    getSlots() {
        // TODO
    }

    getFreeSlots() {
        // TODO
    }

    getFreeWeight() {
        // TODO
    }

    isFull() {
        // TODO
    }

    isEmpty() {
        // TODO
    }

    hasItem() {
        // TODO
    }
}