import { dataSource } from "@server/data/database/app-data-source";
import { IAdminService } from "../IAdminService";
import { Rank } from "./Rank";
import { Player } from "@server/core/player/impl/Player";
import { getPlayerService } from "@server/core/player/impl/PlayerService";

export class AdminService implements IAdminService {
    private rankRepository = dataSource.getRepository(Rank);
    private rankCache = new Map<string, Rank>();

    load() {
        this.rankRepository.find().then(ranks => {
            ranks.forEach(rank => {
                this.rankCache.set(rank.name, rank);
            });
        });
    }

    getRankByName(name: string) {
        return this.rankCache.get(name);
    }

    setPlayerAduty = (player: Player, aduty: boolean) => {
        player.aduty = aduty;
    }
    setPlayerRank = (player: Player, rank: Rank) => {
        player.rank = rank;
        getPlayerService().savePlayer(player);
    }
}

export const adminServiceInitializer = {
    load: () => {
        adminService = new AdminService();
        adminService.load();
    }
}

export const getAdminService = () => {
    if (!adminService) {
        throw new Error("AdminService not initialized");
    }
    return adminService;
}

let adminService: IAdminService;
export default adminService;