import { PedDto } from "@server/core/foundation/PedDto";
import { getStreamer } from "@server/core/foundation/Streamer";
import { Shop } from "@server/core/shop/impl/Shop";
import { dataSource } from "@server/data/database/app-data-source";
import { ShopType } from "@shared/enum/ShopType";
import { Blip } from "@shared/types/Blip";
import { IShopService } from "../IShopService";
import { ShopItem } from "./ShopItem";

export class ShopService implements IShopService {
    private shopRepository = dataSource.getRepository(Shop);
    private shopItemsRepository = dataSource.getRepository(ShopItem);

    private shops: Shop[] = [];

    load() {
        this.shopRepository.find().then((shops) => {
            this.shops = shops;
            console.log(`${shops.length} Shops wurden geladen.`);
            shops.forEach(shop => {
                this.createBlip(shop);
                getStreamer().createPed(new PedDto(shop.npc, shop.position));
            });
        });

        this.shopItemsRepository.find().then((shopItems) => {
            shopItems.forEach(shopItem => {
                const shop = this.shops.find(shop => shop.id === shopItem.shopId);
                if (shop) {
                    shop.items.push(shopItem);
                }
            });
        });
    }

    async createShop(shop: Shop): Promise<Shop> {
        shop = await this.shopRepository.save(shop);
        this.shops.push(shop);
        this.createBlip(shop);
        return shop;
    }

    private createBlip(shop: Shop) {
        let color;
        let type;
        let name = '';
        switch (shop.type) {
            case ShopType.SUPERMARKET:
                color = 2;
                type = 52;
                name = 'Supermarkt';
                break;
            case ShopType.WEAPONSHOP:
                color = 1;
                type = 110;
                name = 'Waffenladen';
                break;
        }
        getStreamer().createBlip(new Blip(
            `shop_${shop.id}`,
            shop.position,
            name,
            type,
            color,
            1
        ));
    }

    getShopById(id: number): Shop | undefined {
        return this.shops.find(shop => shop.id === id);
    }

    getShops(): Shop[] {
        return this.shops;
    }

    getItemById(id: number): ShopItem | undefined {
        return this.shops.flatMap(shop => shop.items).find(item => item.id === id);
    }
}

let shopService: IShopService;

export const shopServiceInitializer = {
    load: () => {
        shopService = new ShopService();
        shopService.load();
    },
}

export const getShopService = (): IShopService => {
    return shopService;
}