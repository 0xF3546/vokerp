import { dataSource } from "@server/data/database/app-data-source";
import { IAdminService } from "../IAdminService";
import { Rank } from "./Rank";

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
}

const adminService: IAdminService = new AdminService();
export default adminService;