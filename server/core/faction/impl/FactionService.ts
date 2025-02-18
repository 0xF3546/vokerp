import { dataSource } from "../../../data/database/app-data-source";
import { IFactionService } from "../IFactionService";
import { Faction } from "./Faction";

export class FactionService implements IFactionService {
    private factionRepository = dataSource.getRepository(Faction);
    private factionCache = new Map<number, Faction>();

    saveFaction(faction: Faction) {
        return this.factionRepository.save(faction);
    }

    findFactionById(id: number) {
        return this.factionRepository.findOne({
            where: {
                id: id
            }
        });
    }

    getFactionById(id: number) {
        if (this.factionCache.has(id)) {
            return this.factionCache.get(id);
        } else {
            this.findFactionById(id).then(faction => {
                if (faction) {
                    this.factionCache.set(id, faction);
                }
                return faction;
            });
        }
    }

}

const factionService = new FactionService()
export default factionService;