import { Faction } from "./impl/Faction"

export type IFactionService = {

    saveFaction(faction: Faction): Promise<Faction>
    findFactionById(id: number): Promise<Faction | null>
    getFactionById(id: number): Faction | undefined
    load: () => void
}