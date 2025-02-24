import { Inventory } from "./impl/Inventory"
import { InventoryItem } from "./impl/InventoryItem"

export type IInventoryService = {
    /**
     * 
     * @param id 
     * @returns 
     */
    findInventoryById: (id: number) => Promise<Inventory | null>
    saveInventory: (inventory: Inventory) => Promise<Inventory>
    getById: (id: number) => Inventory | undefined
    updateInventoryItem: (inventoryItem: InventoryItem) => Promise<InventoryItem>
}