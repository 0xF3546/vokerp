import { dataSource } from "../../../data/database/app-data-source";
import { IInventoryService } from "../IInventoryService";
import { Inventory } from "./Inventory";

export class InventoryService implements IInventoryService {
    private inventoryRepository = dataSource.getRepository(Inventory);
    /**
     * Cache for Inventories, `key = id`, `value = Inventory`
     */
    private inventoryCache = new Map<number, Inventory>();

    async findInventoryById(id: number) {
        return await this.inventoryRepository.findOne({
            where: {
                id: id
            }
        });
    }

    async saveInventory(inventory: Inventory) {
        return await this.inventoryRepository.save(inventory);
    }

    getById(id: number) {
        if (this.inventoryCache.has(id)) {
            return this.inventoryCache.get(id);
        } else {
            this.findInventoryById(id).then(inventory => {
                if (inventory) {
                    this.inventoryCache.set(id, inventory);
                    return inventory;
                }
            });
        }
    }
}