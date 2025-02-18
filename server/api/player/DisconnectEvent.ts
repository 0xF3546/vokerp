import playerService from "../../core/player/impl/PlayerService";

on("playerDropped", async (reason: string, resourceName: string, clientDropReason: number) => {
    const player = await playerService.findPlayerByLicense(getPlayerIdentifiers(source)[3]);
    if (player == null) return;
    playerService.savePlayer(player);
});