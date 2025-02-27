import { eventManager } from "@server/core/foundation/EventManager";
import { Warehouse } from "@server/core/inventory/impl/Warehouse";
import { getWarehouseService } from "@server/core/inventory/impl/WarehouseService";
import { getPlayerService } from "@server/core/player/impl/PlayerService";

eventManager.on("Warehouse::Unlock", (source) => {
    const player = getPlayerService().getBySource(source);
    if (!player) return;
    let warehouse: Warehouse;
    if (player.getDimension() !== 0) {
        warehouse = getWarehouseService().getWarehouse(player.getDimension());
    } else {
        warehouse = getWarehouseService().getNearestWarehouse(player.character.position).warehouse;
    }

    warehouse.isDoorOpen = true;
});