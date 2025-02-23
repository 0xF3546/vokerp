import commandManager from "@server/core/foundation/CommandManager";
import { getGamePlay } from "@server/core/gameplay/impl/Gameplay";
import { Player } from "@server/core/player/impl/Player";

commandManager.add("setJumpPointExit", (player: Player, args) => {
    if (player.rank.permLevel < 90) return;
    if (args.length !== 1) {
        player.notify("", "Nutze: /setJumpPointExit [ID]");
        return;
    }
    console.log(args);
    const id = args[0];
    console.log("ID:", id);
    const jumpPoint = getGamePlay().getJumpPointById(id);
    if (!jumpPoint) {
        player.notify("", "JumpPoint nicht gefunden.");
        return;
    }
    jumpPoint.exitPoint = player.character.position;
    getGamePlay().updateJumpPoint(jumpPoint).then(() => {
        player.notify("", `JumpPoint Eintrittspunkt gesetzt.`);
    });
});