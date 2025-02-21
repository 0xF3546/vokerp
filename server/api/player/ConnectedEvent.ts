import { getStreamer } from "@server/core/foundation/Streamer";
import { getPlayerService } from "../../core/player/impl/PlayerService";

onNet('playerJoined', async () => {
    const source = global.source.toString();
    console.log(`Player ${source} is joining the server!`);
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