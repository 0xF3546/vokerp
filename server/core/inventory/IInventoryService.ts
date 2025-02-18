import { Inventory } from "./impl/Inventory"

export type IInventoryService = {
    /**
     * 
     * @param id 
     * @returns 
     */
    findInventoryById: (id: number) => Promise<Inventory | null>
    saveInventory: (inventory: Inventory) => Promise<Inventory>
    getById: (id: number) => Inventory | undefined
}