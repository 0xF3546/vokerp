import { Player } from "./impl/Player"
import { PlayerBan } from "./impl/PlayerBan"

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

    /**
    * init a player
    * @param player player instance
    * @param source fivem global.source of the player
    */

    init: (player: Player, source: number) => void

    /**
    * load a player
    * @param player player instance
    */
    load: (player: Player) => void

    /**
    * trigger when player is dropped
    * @param source fivem global.source of the player
    */
    playerDropped: (source: number) => void

    /**
     * 
     * @param source fivem global.source of the player
     * @returns new player instance
     *      
     */
    createPlayer: (source: number) => Promise<Player>

    checkBan: (license: string) => Promise<PlayerBan | null>
}