import { eventManager } from "@server/core/foundation/EventManager";
import { getGamePlay } from "@server/core/gameplay/impl/Gameplay";
import { Player } from "@server/core/player/impl/Player";
import { getPlayerService } from "@server/core/player/impl/PlayerService";
import { JumpPointDto } from "@shared/models/JumpPointDto";

eventManager.on('playerSpawned', async (source: number) => {
    const player: Player = getPlayerService().getBySource(source);
    player.character.load();

    const jumpPoints: JumpPointDto[] = getGamePlay().getJumpPoints();
    eventManager.emitClient(player.source, 'GamePlay::SyncJumpPoints', JSON.stringify(jumpPoints));
});