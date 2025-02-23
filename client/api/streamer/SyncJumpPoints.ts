import { eventManager } from "client/core/foundation/EventManager";
import { gamePlay } from "client/core/gameplay/impl/Gameplay";

eventManager.on("GamePlay::SyncJumpPoints", (data: string) => {
    const jumpPoints = JSON.parse(data);
    gamePlay.setJumpPoints(jumpPoints);
});