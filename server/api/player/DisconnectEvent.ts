import playerService from "../../core/player/impl/PlayerService";

on("playerDropped", async (reason: string, resourceName: string, clientDropReason: number) => {
    const player = playerService.getBySource(source);
    if (player == null) return;
    playerService.savePlayer(player);
});