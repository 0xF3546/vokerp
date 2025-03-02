import { eventManager } from "@server/core/foundation/EventManager";
import { getPlayerService } from "@server/core/player/impl/PlayerService";
import { getVehicleService } from "@server/core/vehicle/impl/VehicleService";

eventManager.onCallback(`Garage::ParkoutVehicle`, async (source, data) => {
    data = JSON.parse(data);
    const player = getPlayerService().getBySource(source);
    const vehicle = await getVehicleService().findVehicle(data);
    if (!vehicle) return JSON.stringify({ success: false, error: "Vehicle not found" });
    if (!getVehicleService().unparkVehicle(vehicle)) {
        player.notify(`Garage`, `Es ist kein freier Ausparkpunkt verfügbar`, `red`);
        return JSON.stringify({ success: false, error: "Vehicle not found in garage" });
    }
    return JSON.stringify({ success: true });
});