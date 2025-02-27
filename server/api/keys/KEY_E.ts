import { eventManager } from "@server/core/foundation/EventManager";
import { ProgressBar } from "@server/core/foundation/Progressbar";
import { getDistanceBetween } from "@server/core/foundation/Utils";
import { getGamePlay } from "@server/core/gameplay/impl/Gameplay";
import { getHouseService } from "@server/core/gameplay/impl/HouseService";
import { getWarehouseService } from "@server/core/inventory/impl/WarehouseService";
import { Player } from "@server/core/player/impl/Player";
import { getPlayerService } from "@server/core/player/impl/PlayerService";
import { getShopService } from "@server/core/shop/impl/ShopService";
import { getVehicleService } from "@server/core/vehicle/impl/VehicleService";
import { JumpPointType } from "@shared/types/JumpPointType";

eventManager.on('KEY::E', async (source: number) => {
    const player: Player = getPlayerService().getBySource(source);
    if (ProgressBar.hide(player)) return;
    if (player.getVariable("isInHouse") || player.getVariable("isInBasement")) {
        const houseId = player.getVariable("houseId");
        const houes = getHouseService().getHouseById(houseId);
        if (houes.isDoorOpen) {
            eventManager.emitWebView(player.source, "showComponent", "house");
        }
        return;
    }
    getGamePlay().getJumpPoints().forEach(jumpPoint => {
        if (getDistanceBetween(player.character.position, jumpPoint.enterPoint) < jumpPoint.rangeAtFirstPoint) {
            getGamePlay().useJumpPoint(player, jumpPoint, JumpPointType.ENTER);
            return;
        } else if (getDistanceBetween(player.character.position, jumpPoint.exitPoint) < jumpPoint.rangeAtSecondPoint) {
            getGamePlay().useJumpPoint(player, jumpPoint, JumpPointType.EXIT);
            return;
        }
    });

    getShopService().getShops().forEach(shop => {
        if (getDistanceBetween(player.character.position, shop.position) < 5) {
            player.setVariable("shopId", shop.id);
            eventManager.emitWebView(player.source, "showComponent", "shop");
            return;
        }
    });

    if (getVehicleService().getNearestGarage(player.character.position).distance < 5) {
        eventManager.emitWebView(player.source, "showComponent", "garage");
        return;
    }

    getVehicleService().getVehicleShops().forEach(vehicleShop => {
        if (getDistanceBetween(player.character.position, vehicleShop.position) < 5) {
            eventManager.emitWebView(player.source, "showComponent", "vehicleshop");
            return;
        }
    });

    getHouseService().getHouses().forEach(house => {
        if (getDistanceBetween(player.character.position, house.position) < 5) {
            eventManager.emitWebView(player.source, "showComponent", "house");
            return;
        }
    });

    getWarehouseService().getWarehouses().forEach(warehouse => {
        if (getDistanceBetween(player.character.position, warehouse.position) < 5) {
            eventManager.emitWebView(player.source, "showComponent", "warehouse");
            return;
        }
    });
});