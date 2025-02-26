import { eventManager } from "@server/core/foundation/EventManager";
import { getPlayerService } from "@server/core/player/impl/PlayerService";
import { getVehicleService } from "@server/core/vehicle/impl/VehicleService";

eventManager.onCallback("VehicleShop::Purchase", async (source, data) => {
    const player = getPlayerService().getBySource(source);
    if (!player) {
        return null;
    }
    const id = JSON.parse(data);
    const vehicle = getVehicleService().getVehicleShopVehicleById(id);
    if (!vehicle) {
        return null;
    }
    const vehicleShop = getVehicleService().getNearestVehicleShop(player.character.position);
    if (getVehicleService().purchaseVehicle(player.character, vehicle)) {
        player.notify(`${vehicleShop.VehicleShop.name}`, `Du hast das Fahrzeug ${getVehicleService().getClassById(vehicle.vehicleClass)} für ${vehicle.price} gekauft.`);
        return true;
    }
    return false;
});