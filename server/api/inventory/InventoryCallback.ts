import { eventManager } from "@server/core/foundation/EventManager";
import { Player } from "@server/core/player/impl/Player";
import { getPlayerService } from "@server/core/player/impl/PlayerService";

eventManager.onCallback("Inventory::Get", (source) => {
    const player: Player = getPlayerService().getBySource(source);
    return player.character.inventory.getDto();
});