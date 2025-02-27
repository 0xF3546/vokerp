import { eventManager } from "../../core/foundation/EventManager";
import { getWarehouseService } from "../../core/inventory/impl/WarehouseService";
import { getPlayerService } from "../../core/player/impl/PlayerService";

eventManager.on("Warehouse::Enter", (source) => {
    const player = getPlayerService().getBySource(source);
    if (!player) return;
    const warehouse = getWarehouseService().getNearestWarehouse(player.character.position);
    if (!warehouse) return;
    if (warehouse.distance > 5) return player.notify("Lagerhalle", "Du bist zu weit entfernt von der Lagerhalle!");
    if (!warehouse.warehouse.isDoorOpen) return player.notify("Lagerhalle", "Die Lagerhalle ist verschlossen!");
    player.character.position = warehouse.warehouse.getStage().position;
    player.setDimension(warehouse.warehouse.id);
    eventManager.emitWebView(player, "hideComponent", "warehouse");
});