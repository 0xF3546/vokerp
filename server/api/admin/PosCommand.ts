import commandManager from "@server/core/foundation/CommandManager";
import { eventManager } from "@server/core/foundation/EventManager";
import { Player } from "@server/core/player/impl/Player";

commandManager.add(("pos"), (player: Player, args) => {
    eventManager.emitWebView(player.source, "copyPos", JSON.stringify(player.character.position));
    player.notify("Position", `Deine Position wurde in die Zwischenablage kopiert.`, "green", 5000);
});