import { dataSource } from "@server/data/database/app-data-source";
import { IGameplay } from "../IGameplay";
import { JumpPoint } from "./JumpPoint";
import { JumpPointType } from "@shared/types/JumpPointType";
import { Shop } from "./Shop";
import { getStreamer } from "@server/core/foundation/Streamer";
import { ShopType } from "@shared/enum/ShopType";
import { Blip } from "@shared/types/Blip";
import { ClotheShop } from "./ClotheShop";
import { PedDto } from "@server/core/foundation/PedDto";

export class GamePlay implements IGameplay {
    private jumpPointRepository = dataSource.getRepository(JumpPoint);
    private shopRepository = dataSource.getRepository(Shop);
    private clothesShopRepository = dataSource.getRepository(ClotheShop);
    private jumpPoints: JumpPoint[] = [];
    private shops: Shop[] = [];
    private clothesShops: ClotheShop[] = [];

    load() {
        this.jumpPointRepository.find().then((jumpPoints) => {
            this.jumpPoints = jumpPoints;
            console.log(`${jumpPoints.length} JumpPoints wurden geladen.`);
        });

        this.shopRepository.find().then((shops) => {
            this.shops = shops;
            console.log(`${shops.length} Shops wurden geladen.`);
            shops.forEach(shop => {
                this.createBlip(shop);
                getStreamer().createPed(new PedDto(shop.npc, shop.position));
            });
        });

        this.clothesShopRepository.find().then((clothesShops) => {
            this.clothesShops = clothesShops;
            clothesShops.forEach(clothesShop => {
                getStreamer().createPed(new PedDto(clothesShop.npc, clothesShop.position))
                getStreamer().createBlip(new Blip(
                    `clotheShop_${clothesShop.id}`,
                    clothesShop.position,
                    clothesShop.name,
                    73,
                    0,
                    1
                ));
            });
        });
    }

    async createJumpPoint(jumpPoint: JumpPoint): Promise<JumpPoint> {
        jumpPoint = await this.jumpPointRepository.save(jumpPoint);
        this.jumpPoints.push(jumpPoint);
        return jumpPoint;
    }

    getJumpPointById(id: number): JumpPoint | undefined {
        return this.jumpPoints.find(jumpPoint => jumpPoint.id === id);
    }

    getJumpPoints(): JumpPoint[] {
        return this.jumpPoints;
    }

    async updateJumpPoint(jumpPoint: JumpPoint): Promise<JumpPoint> {
        return await this.jumpPointRepository.save(jumpPoint);
    }

    async deleteJumpPoint(jumpPoint: JumpPoint): Promise<void> {
        this.jumpPoints = this.jumpPoints.filter(jp => jp.id !== jumpPoint.id);
        await this.jumpPointRepository.delete(jumpPoint);
    }

    useJumpPoint(player: any, jumpPoint: JumpPoint, jumpPointType: JumpPointType) {
        if (jumpPointType === JumpPointType.ENTER) {
            player.character.position = jumpPoint.enterPoint;
        } else if (jumpPointType === JumpPointType.EXIT) {
            player.character.position = jumpPoint.exitPoint;
        }
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
        switch (shop.type) {
            case ShopType.SUPERMARKET:
                color = 2;
                type = 52;
                break;
            case ShopType.WEAPONSHOP:
                color = 1;
                type = 110;
                break;
        }
        getStreamer().createBlip(new Blip(
            `shop_${shop.id}`,
            shop.position,
            shop.name,
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

    async createClotheShop(clotheShop: ClotheShop): Promise<ClotheShop> {
        clotheShop = await this.clothesShopRepository.save(clotheShop);
        this.clothesShops.push(clotheShop);

        getStreamer().createBlip(new Blip(
            `clotheShop_${clotheShop.id}`,
            clotheShop.position,
            clotheShop.name,
            73,
            0,
            1
        ));
        return clotheShop;
    }

    getClotheShopById(id: number): ClotheShop | undefined {
        return this.clothesShops.find(clotheShop => clotheShop.id === id);
    }

    getClotheShops(): ClotheShop[] {
        return this.clothesShops;
    }
}

let gamePlay: IGameplay;

export const gamePlayInitializer = {
    load: () => {
        gamePlay = new GamePlay();
        gamePlay.load();
    }
}

export const getGamePlay = () => {
    if (!gamePlay) {
        throw new Error("GamePlay not initialized");
    }
    return gamePlay;
}
