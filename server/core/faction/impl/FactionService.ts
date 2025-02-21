import { dataSource } from "../../../data/database/app-data-source";
import { IFactionService } from "../IFactionService";
import { Faction } from "./Faction";

export class FactionService implements IFactionService {
    private factionRepository = dataSource.getRepository(Faction);
    private factionCache = new Map<number, Faction>();

    load() {
        this.factionRepository.find().then(factions => {
            factions.forEach(faction => {
                this.factionCache.set(faction.id, faction);
            });
        });
    }

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

let factionService: IFactionService = new FactionService()
export default factionService;