import { getPlayerService } from "../../core/player/impl/PlayerService";

on("playerDropped", async (reason: string, resourceName: string, clientDropReason: number) => {
    const player = getPlayerService().getBySource(source);
    if (player == null) return;
    getPlayerService().savePlayer(player);
});