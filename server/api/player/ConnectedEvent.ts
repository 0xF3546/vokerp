import { getStreamer } from "@server/core/foundation/Streamer";
import { getPlayerService } from "../../core/player/impl/PlayerService";
import { eventManager } from "@server/core/foundation/EventManager";

eventManager.on('playerJoined', async (source: number | string) => {
    console.log(`Player ${source} is joining the server!`);
    source = source.toString()
    if (GetPlayerPed(source) === 0) return;
    console.log(`Parsed = ${parseInt(source)}`);
    const identifiers = getPlayerIdentifiers(source);
    const player = await getPlayerService().findPlayerByLicense(identifiers['license']);
    if (!player) {
        await getPlayerService().createPlayer(parseInt(source));
    }

    getPlayerService().init(player, parseInt(source));
    getPlayerService().load(player);
    getStreamer().loadForPlayer(player);
})