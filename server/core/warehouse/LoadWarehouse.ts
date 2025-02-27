import { WarehouseDto } from "@shared/models/WarehouseDto";
import { eventManager } from "../foundation/EventManager";
import { getWarehouseService } from "../inventory/impl/WarehouseService";
import { getPlayerService } from "../player/impl/PlayerService";
import { Warehouse } from "../inventory/impl/Warehouse";

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