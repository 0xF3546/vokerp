import { dataSource } from "../../../data/database/app-data-source";
import { IInventoryService } from "../IInventoryService";
import { Inventory } from "./Inventory";
import { InventoryItem } from "./InventoryItem";
import { Item } from "./Item";

export class InventoryService implements IInventoryService {
    private inventoryRepository = dataSource.getRepository(Inventory);
    /**
     * Cache for Inventories, `key = id`, `value = Inventory`
     */
    private inventoryCache = new Map<number, Inventory>();
    private itemRepository = dataSource.getRepository(Item);
    private itemCache: Item[] = [];

    load() {
        this.itemRepository.find().then(items => {
            this.itemCache = items;
            console.log(`${items.length} Items wurden geladen.`);
        });
    }


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

    async updateInventoryItem(inventoryItem: InventoryItem) {
        return await dataSource.getRepository(InventoryItem).save(inventoryItem);
    }

    getItembyId(id: number) {
        return this.itemCache.find(item => item.id === id);
    }
}

let inventoryService: IInventoryService;

export const inventoryServiceInitializer = {
    load: () => {
        inventoryService = new InventoryService();
        inventoryService.load();
    }
}

export function getInventoryService(): IInventoryService {
    if (!inventoryService) {
        inventoryService = new InventoryService();
    }
    return inventoryService;
}