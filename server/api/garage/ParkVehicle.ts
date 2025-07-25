import { eventManager } from "@server/core/foundation/EventManager";
import { getVehicleService } from "@server/core/vehicle/impl/VehicleService";

eventManager.onCallback(`Garage::ParkVehicle`, async (source, data) => {
    data = JSON.parse(data);
    const vehicle = await getVehicleService().getVehicle(data);
        if (!vehicle) return JSON.stringify({ success: false, error: "Vehicle not found" });
    getVehicleService().parkVehicle(vehicle);
    return Promise.resolve(JSON.stringify({ success: true }));
});