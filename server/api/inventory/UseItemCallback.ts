import { eventManager } from "@server/core/foundation/EventManager";
import { getPlayerService } from "@server/core/player/impl/PlayerService";

eventManager.onCallback("Inventory::UseItem", (source, itemId, amount = 1) => {
    const player = getPlayerService().getBySource(source);
    if (player.character.inventory.hasItem(itemId)) {
        const item = player.character.inventory.getItem(itemId);
        eventManager.emit(player, `Inventory::UseItem::${item.item.name}`, amount);
        return true;
    }
    return false;
}); 