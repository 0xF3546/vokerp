import { Inventory } from "./impl/Inventory"
import { InventoryItem } from "./impl/InventoryItem"
import { Item } from "./impl/Item"

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
    load: () => void
    getItembyId: (id: number) => Item | undefined
}