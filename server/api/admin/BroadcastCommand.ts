import commandManager from "@server/core/foundation/CommandManager";
import { notifications } from "@server/core/foundation/Utils";
import { Player } from "@server/core/player/impl/Player";

commandManager.add("broadcast", (player: Player, args) => {
    if (player.rank.permLevel < 50) return;
    if (args.length < 1) {
        player.notify("", "Bitte gib eine Nachricht an", "red");
        return;
    }
    const message = args.join(" ");

    notifications.sendBroadcast("Ankündigung", message, "green", 12000);
});