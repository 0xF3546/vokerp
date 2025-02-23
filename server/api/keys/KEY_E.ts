import { eventManager } from "@server/core/foundation/EventManager";
import { getDistanceBetween } from "@server/core/foundation/Utils";
import { getGamePlay } from "@server/core/gameplay/impl/Gameplay";
import { Player } from "@server/core/player/impl/Player";
import { getPlayerService } from "@server/core/player/impl/PlayerService";
import { JumpPointType } from "@shared/types/JumpPointType";

eventManager.on('KEY::E', async (source: number) => {
    const player: Player = getPlayerService().getBySource(source);
    getGamePlay().getJumpPoints().forEach(jumpPoint => {
        if (getDistanceBetween(player.character.position, jumpPoint.enterPoint) < jumpPoint.rangeAtFirstPoint) {
            getGamePlay().useJumpPoint(player, jumpPoint, JumpPointType.ENTER);
        } else if (getDistanceBetween(player.character.position, jumpPoint.exitPoint) < jumpPoint.rangeAtSecondPoint) {
            getGamePlay().useJumpPoint(player, jumpPoint, JumpPointType.EXIT);
        }
    });
});