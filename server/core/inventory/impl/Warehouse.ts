import { Position } from "@shared/types/Position";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Inventory } from "./Inventory";
import { getWarehouseService } from "./WarehouseService";

@Entity("warehouses")
export class Warehouse {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name: string;

    @Column({ default: null })
    ownerId: number | null;

    @Column("json")
    position!: Position;

    @Column({ default: 1 })
    stage: number;

    @Column()
    price: number;

    @OneToOne(() => Inventory, { cascade: true, eager: true })
    @JoinColumn()
    inventory: Inventory;

    isDoorOpen: boolean = false;

    getStage() {
        return getWarehouseService().getWarehouseStage(this.stage);
    }
}