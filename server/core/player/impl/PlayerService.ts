import { IPlayerService } from "../IPlayerService";
import { dataSource } from "@server/data/database/app-data-source";
import { Player } from "./Player";
import { PositionParser } from "../../foundation/PositionParser";
import { Character } from "@server/core/character/impl/Character";
import { eventManager } from "@server/core/foundation/EventManager";
import { PlayerBan } from "./PlayerBan";
import { LoadedPlayer } from "@shared/types/LoadedPlayer";

export class PlayerService implements IPlayerService {
    private playerBanRepository = dataSource.getRepository(PlayerBan);
    private playerRepository = dataSource.getRepository(Player);
    /**
     * Cache for Players
     */
    private playerCache: Player[] = [];

    async findPlayerById(id: number) {

        return await this.playerRepository.findOne({
            where: {
                id: id
            },
            relations: ["character"]
        });

    }

    async savePlayer(player: Player) {
        const ped = player.getPed();
        player.character.lastPosition = player.character.position;
        player.character.armour = GetPedArmour(ped);
        player.character.health = GetEntityHealth(ped);
        return await this.playerRepository.save(player);
    }

    findPlayerByLicense(license: string) {
        return this.playerRepository.findOne({
            where: {
                license: license
            }
        });
    }

    updateIdentifiers(player: Player, identifiers: string[]) {
        player.license = identifiers['license'];
        player.identifiers = identifiers;
        return this.savePlayer(player);
    }

    getBySource(source: number) {
        return this.playerCache.find(player => player.source === source);
    }

    init(player: Player, source: number) {
        this.playerCache.push(player);
        player.source = source;
        player.character.player = player;
    }

    load(player: Player) {
        console.log(`Loading Player ${player.id} with source ${player.source}...`);
        console.log(GetPlayerName(player.source.toString()));
        if (!player.character) {
            console.error(`Character für Spieler ${player.id} nicht geladen!`);
            return;
        }

        player.character.position = player.character.lastPosition;

        const loadedData: LoadedPlayer = {
            firstname: player.character.firstname,
            lastname: player.character.lastname,
            gender: player.character.gender,
            position: player.character.lastPosition,
          }

        eventManager.emitClient(player.source, "playerLoaded", JSON.stringify(loadedData));
    }

    playerDropped(source: number) {
        const player = this.getBySource(source);
        if (player) {
            this.savePlayer(player);
            this.playerCache.splice(this.playerCache.indexOf(player), 1);
        }
    }

    async createPlayer(source: number) {
        const player = new Player(source);
        player.source = source;
        const identifiers = getPlayerIdentifiers(source);
        player.license = identifiers['license'];
        player.identifiers = identifiers;
        player.steamId = identifiers['steam'];
        player.character = new Character();
        return await this.playerRepository.save(player);
    }

    async checkBan(license: string) {
        const player = await this.findPlayerByLicense(license);
        if (!player) return null;
        return await this.playerBanRepository.findOne({
            where: {
                player: { id: player.id}
            }
        }) || null;
    }

    getPlayers() {
        return this.playerCache;
    }

    getByCharId(charId: number) {
        return this.playerCache.find(player => player.character.id === charId);
    } 
}

export const playerServiceInitializer = {
    load: () => {
        playerService = new PlayerService();
    }
}

export const getPlayerService = () => {
    if (!playerService) {
        throw new Error("PlayerService is not initialized. Call playerServiceInitializer.load() first.");
    }
    return playerService;
}

let playerService: IPlayerService;

export default playerService;