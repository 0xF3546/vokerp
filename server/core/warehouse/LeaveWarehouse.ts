import { eventManager } from "../foundation/EventManager";
import { getWarehouseService } from "../inventory/impl/WarehouseService";
import { getPlayerService } from "../player/impl/PlayerService";

eventManager.on("Warehouse::Leave", (source) => {
    const player = getPlayerService().getBySource(source);
    if (!player) return;
    const warehouse = getWarehouseService().getWarehouse(player.getDimension());
    if (!warehouse) return;
    if (!warehouse.isDoorOpen) return player.notify("Lagerhalle", "Die Lagerhalle ist verschlossen!");
    player.character.position = warehouse.position;
    eventManager.emitWebView(player, "hideComponent", "warehouse");
});