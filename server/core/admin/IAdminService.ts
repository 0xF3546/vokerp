import { Player } from "../player/impl/Player";
import { Rank } from "./impl/Rank";

export type IAdminService = {
    getRankByName: (name: string) => Rank;
    load: () => void;
    setPlayerAduty: (player: Player, aduty: boolean) => void;
    setPlayerRank: (player: Player, rank: Rank) => void;
}