import { IPlayerService } from "../IPlayerService";
import { dataSource } from "../../../data/database/app-data-source";
import { Player } from "./Player";
import { PositionParser } from "../../foundation/PositionParser";

export class PlayerService implements IPlayerService {
    private playerRepository = dataSource.getRepository(Player);
    /**
     * Cache for Players, `key = source`, `value = Player`
     */
    private playerCache = new Map<number, Player>();

    async findPlayerById(id: number) {

        return await this.playerRepository.findOne({
            where: {
                id: id
            }
        });

    }

    async savePlayer(player: Player) {
        player.character.lastPosition = PositionParser.toPosition(GetEntityCoords(GetPlayerPed(player.source.toString())));
        player.character.armour = GetPedArmour(GetPlayerPed(player.source.toString()));
        player.character.health = GetEntityHealth(GetPlayerPed(player.source.toString()));
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
        player.license = identifiers[3];
        player.identifiers = identifiers;
        return this.savePlayer(player);
    }

    getBySource(source: number) {
        return this.playerCache.get(source);
    }

    init(player: Player, source: number) {
        this.playerCache.set(source, player);
        player.source = source;
    }

    load(player: Player) {
        PositionParser.applyPosition(player.source, player.character.lastPosition);
    }

    playerDropped(source: number) {
        const player = this.getBySource(source);
        if (player) {
            this.savePlayer(player);
            this.playerCache.delete(source);
        }
    }
}

const playerService = new PlayerService();

export default playerService;