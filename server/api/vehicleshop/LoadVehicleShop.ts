import { eventManager } from "@server/core/foundation/EventManager";
import { getPlayerService } from "@server/core/player/impl/PlayerService";
import { getVehicleService } from "@server/core/vehicle/impl/VehicleService";
import { VehicleShopDto } from "@shared/models/VehicleShopDto";

eventManager.onCallback("VehicleShop::Load", async (source) => {
    const player = getPlayerService().getBySource(source);
    if (!player) return;
    const vehicleShop = getVehicleService().getNearestVehicleShop(player.character.position);
    if (!vehicleShop) return;
    if (vehicleShop.distance > 5) return;

    const dto: VehicleShopDto = {
        id: vehicleShop.VehicleShop.id,
        name: vehicleShop.VehicleShop.name,
        vehicles: vehicleShop.VehicleShop.vehicles.map(vehicle => ({
            id: vehicle.id,
            name: getVehicleService().getClassById(vehicle.vehicleClass).displayName,
            shopId: vehicle.shopId,
            vehicleClass: vehicle.vehicleClass,
            price: vehicle.price,
            position: vehicle.position,
            available: vehicle.available
        }))
    };
    return JSON.stringify(dto);
});