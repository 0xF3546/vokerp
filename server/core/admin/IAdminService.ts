import { Rank } from "./impl/Rank";

export type IAdminService = {
    getRankByName: (name: string) => Rank;
    load: () => void;
}