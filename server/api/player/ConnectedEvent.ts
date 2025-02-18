import { PositionParser } from "../../core/foundation/PositionParser";
import playerService from "../../core/player/impl/PlayerService";

on('playerJoining', async (source: string, oldID: string) => {
    const identifiers = getPlayerIdentifiers(source);
    const player = await playerService.findPlayerByLicense(identifiers[3]);
    DropPlayer(source, "Es gab ein Fehler beim laden deines Charakters!");
    if (!player) return;

    playerService.init(player, parseInt(source));
    playerService.load(player);
})