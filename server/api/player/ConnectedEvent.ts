import playerService from "../../core/player/impl/PlayerService";

onNet('playerJoined', async () => {
    const source = global.source.toString();
    console.log(`Player ${source} is joining the server!`);
    if (GetPlayerPed(source) === 0) return;
    console.log(`Parsed = ${parseInt(source)}`);
    const identifiers = getPlayerIdentifiers(source);
    const player = await playerService.findPlayerByLicense(identifiers[3]);
    if (!player) {
        await playerService.createPlayer(parseInt(source));
    }

    playerService.init(player, parseInt(source));
    playerService.load(player);
})