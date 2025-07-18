import { JumpPointType } from "@shared/types/JumpPointType";
import { Player } from "../player/impl/Player";
import { JumpPoint } from "./impl/JumpPoint"
import { Shop } from "../shop/impl/Shop";
import { ClotheShop } from "./impl/ClotheShop";

export type IGameplay = {
    load: () => void;
    createJumpPoint: (jumpPoint: JumpPoint) => Promise<JumpPoint>
    getJumpPointById: (id: number) => JumpPoint | undefined
    getJumpPoints: () => JumpPoint[]
    updateJumpPoint: (jumpPoint: JumpPoint) => Promise<JumpPoint>
    deleteJumpPoint: (jumpPoint: JumpPoint) => Promise<void>
    useJumpPoint: (player: Player, jumpPoint: JumpPoint, jumpPointType: JumpPointType) => void

    createClotheShop: (clotheShop: ClotheShop) => Promise<ClotheShop>
    getClotheShopById: (id: number) => ClotheShop | undefined
    getClotheShops: () => ClotheShop[]
}