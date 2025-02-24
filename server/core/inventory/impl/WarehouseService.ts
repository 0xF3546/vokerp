import { dataSource } from "@server/data/database/app-data-source";
import { IWarehouseService } from "../IWarehouseService";
import { Warehouse } from "./Warehouse";
import { Player } from "@server/core/player/impl/Player";
import { WarehouseStage } from "./WarehouseStage";

export class WarehouseService implements IWarehouseService {
    private warehouseRepository = dataSource.getRepository(Warehouse);
    private warehouseStageRepository = dataSource.getRepository(WarehouseStage);
    private warehouses: Warehouse[] = [];
    private warehouseStages: WarehouseStage[] = [];

    load() {
        this.warehouseRepository.find().then(warehouses => {
            this.warehouses = warehouses;
        });

        this.warehouseStageRepository.find().then(stages => {
            this.warehouseStages = stages;
        });
    }

    getWarehouses() {
        return this.warehouses;
    }

    getWarehouseById(id: number) {
        return this.warehouses.find(warehouse => warehouse.id === id);
    }

    async createWarehouse(warehouse: Warehouse) {
        warehouse = await this.warehouseRepository.save(warehouse);
        this.warehouses.push(warehouse);
        return warehouse;
    }

    async deleteWarehouse(id: number) {
        const warehouse = this.getWarehouseById(id);
        if (!warehouse) return;
        await this.warehouseRepository.delete(warehouse);
        this.warehouses = this.warehouses.filter(w => w.id !== id);
    }

    async buyWarehouse(player: Player, warehouse: Warehouse) {
        if (!player.character.removeCash(warehouse.price)) {
            player.notify(`Lagerhalle ${warehouse.id}`, `Du hast nicht genug Geld um die Lagerhalle zu kaufen!`);
            return null;
        }
        warehouse.ownerId = player.character.id;
        player.notify(`Lagerhalle ${warehouse.id}`, `Du hast die Lagerhalle erfolgreich gekauft!`);
        return await this.warehouseRepository.save(warehouse);
    }

    async upgradeWarehouse(player: Player, warehouse: Warehouse) {
        const warehouseStage = this.getWarehouseStage(warehouse.stage + 1);
        if (!warehouseStage) {
            player.notify(`Lagerhalle ${warehouse.id}`, `Die Lagerhalle kann nicht weiter ausgebaut werden!`);
            return null;
        }
        if (!player.character.removeCash(warehouseStage.price)) {
            player.notify(`Lagerhalle ${warehouse.id}`, `Du hast nicht genug Geld um die Lagerhalle zu kaufen!`);
            return null;
        }
        warehouse.stage++;
        player.notify(`Lagerhalle ${warehouse.id}`, `Du hast die Lagerhalle erfolgreich auf Stufe ${warehouse.stage} ausgebaut!`);
        return await this.warehouseRepository.save(warehouse);
    }

    getWarehouse = (id: number): Warehouse => {
        return this.warehouses.find(warehouse => warehouse.id === id);
    }

    getWarehouseStage(stage: number) {
        return this.warehouseStages.find(s => s.stage === stage);
    }
}

let warehouseService: IWarehouseService;
export function getWarehouseService(): IWarehouseService {
    if (!warehouseService) {
        warehouseService = new WarehouseService();
    }
    return warehouseService;
}

export const warehouseServiceInitializer = {
    load: () => {
        warehouseService = new WarehouseService();
        warehouseService.load();
    }
}