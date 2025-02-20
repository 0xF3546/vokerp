import { Player } from "./impl/Player"

export type IPlayerService = {
    /**
     * find a player by the database id
     * @param id database id of the player
     * @returns database instance of player
     */
    findPlayerById: (id: number) => Promise<Player | null>
    /**
     * find a player by the global.source
     * @param source fivem global.source of the player
     * @returns cache instance of player
     */
    getBySource: (source: number) => Player | undefined
    /**
     * find a player by the license
     * @param id rockstar-license of the player
     * @returns database instance of player
     */
    findPlayerByLicense: (license: string) => Promise<Player | null>
    /**
     * save a player to the database
     * @param player player instance
     * @returns saved player instance
     */
    savePlayer: (player: Player) => Promise<Player>
    /**
     * update the identifiers of a player
     * @param player player instance
     * @param identifiers new identifiers
     * @returns updated player instance
     */
    updateIdentifiers: (player: Player, identifiers: string[]) => Promise<Player>

    init: (player: Player, source: number) => void

    load: (player: Player) => void

    playerDropped: (source: number) => void

    createPlayer: (source: number) => Promise<Player>
}