import commandManager from "@server/core/foundation/CommandManager";
import { getGamePlay } from "@server/core/gameplay/impl/Gameplay";
import { Player } from "@server/core/player/impl/Player";

commandManager.add("setJumpPointEntry", (player: Player, args) => {
    if (player.rank.permLevel < 90) return;
    if (args.length !== 1) {
        player.notify("", "Nutze: /setJumpPointEntry [ID]");
        return;
    }
    const id = args[0];
    const jumpPoint = getGamePlay().getJumpPointById(id);
    if (!jumpPoint) {
        player.notify("", "JumpPoint nicht gefunden.");
        return;
    }
    jumpPoint.enterPoint = player.character.position;
    getGamePlay().updateJumpPoint(jumpPoint).then(() => {
        player.notify("", `JumpPoint Eintrittspunkt gesetzt.`);
    });
});