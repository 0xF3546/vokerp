import { Player } from "../player/impl/Player";
import { Warehouse } from "./impl/Warehouse";
import { WarehouseStage } from "./impl/WarehouseStage";

export interface IWarehouseService {
    load: () => void;
    getWarehouse(id: number): Warehouse;
    getWarehouses(): Warehouse[];
    createWarehouse(warehouse: Warehouse): Promise<Warehouse>;
    deleteWarehouse(id: number): Promise<void>;
    buyWarehouse(player: Player, warehouse: Warehouse): Promise<Warehouse>;
    upgradeWarehouse(player: Player, warehouse: Warehouse): Promise<Warehouse>;

    getWarehouseStage(stage: number): WarehouseStage;
}