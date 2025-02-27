import { eventManager } from "../../core/foundation/EventManager";
import { Warehouse } from "../../core/inventory/impl/Warehouse";
import { getWarehouseService } from "../../core/inventory/impl/WarehouseService";
import { getPlayerService } from "../../core/player/impl/PlayerService";

eventManager.onCallback("Warehouse::Upgrade", (source) => {
    const player = getPlayerService().getBySource(source);
    if (!player) return;
    let warehouse: Warehouse;
    if (player.getDimension() !== 0) {
        warehouse = getWarehouseService().getWarehouse(player.getDimension());
    } else {
        warehouse = getWarehouseService().getNearestWarehouse(player.character.position).warehouse;
    }
    if (warehouse.ownerId !== player.character.id) return;
    if (!getWarehouseService().getWarehouseStage(warehouse.stage + 1)) return;
    if (getWarehouseService().upgradeWarehouse(player, warehouse)) {
        eventManager.emitWebView(player, "hideComponent", "warehouse");
        return JSON.stringify({ success: true });
    }
    return JSON.stringify({ success: false });
});