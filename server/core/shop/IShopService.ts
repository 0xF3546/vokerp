import { Shop } from "./impl/Shop"
import { ShopItem } from "./impl/ShopItem"

export type IShopService = {
    load: () => void
    createShop: (shop: Shop) => Promise<Shop>
    getShopById: (id: number) => Shop | undefined
    getShops: () => Shop[]

    getItemById: (id: number) => ShopItem | undefined
}