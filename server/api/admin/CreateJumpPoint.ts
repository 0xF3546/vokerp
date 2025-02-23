import commandManager from "@server/core/foundation/CommandManager";
import { getGamePlay } from "@server/core/gameplay/impl/Gameplay";
import { JumpPoint } from "@server/core/gameplay/impl/JumpPoint";
import { Player } from "@server/core/player/impl/Player";

commandManager.add("createJumpPoint", (player: Player, args) => {    
    if (player.rank.permLevel < 90) return;
    const jumpPoint = new JumpPoint();
    jumpPoint.enterPoint = player.character.position;
    jumpPoint.exitPoint = player.character.position;
    getGamePlay().createJumpPoint(jumpPoint).then(() => {
        player.notify("", `JumpPoint mit der ID ${jumpPoint.id} erstellt.`);
    });
});