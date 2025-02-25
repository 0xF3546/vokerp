import commandManager from "@server/core/foundation/CommandManager";
import { eventManager } from "@server/core/foundation/EventManager";
import { Player } from "@server/core/player/impl/Player";

commandManager.add("inventory", (player: Player) => {
    eventManager.emit(player, "Inventory::Show");
});