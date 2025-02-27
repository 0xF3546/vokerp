import { WarehouseDto } from "@shared/models/WarehouseDto";
import { eventManager } from "../../core/foundation/EventManager";
import { getWarehouseService } from "../../core/inventory/impl/WarehouseService";
import { getPlayerService } from "../../core/player/impl/PlayerService";
import { Warehouse } from "../../core/inventory/impl/Warehouse";

eventManager.onCallback("Warehouse::Load", (source) => {
    const player = getPlayerService().getBySource(source);
    if (!player) return;
    let warehouse: Warehouse;
    if (player.getDimension() !== 0) {
        warehouse = getWarehouseService().getWarehouse(player.getDimension());
    } else {
        warehouse = getWarehouseService().getNearestWarehouse(player.character.position).warehouse;
    }

    const upgradePrice = getWarehouseService().getWarehouseStage(warehouse.stage + 1) ? getWarehouseService().getWarehouseStage(warehouse.stage + 1).price : -1;

    const dto: WarehouseDto = {
        id: warehouse.id,
        street: "soon",
        number: warehouse.id,
        level: warehouse.stage,
        price: warehouse.price,
        isDoorOpen: warehouse.isDoorOpen,
        isInside: player.getDimension() === warehouse.id,
        upgradePrice: upgradePrice,
        isOwner: warehouse.ownerId === player.character.id
    }
    return JSON.stringify(dto);
});