import { eventManager } from "@server/core/foundation/EventManager";
import { getVehicleService } from "@server/core/vehicle/impl/VehicleService";

eventManager.onCallback(`Garage::ParkVehicle`, async (source, data) => {
    console.log(data);
    const vehicle = await getVehicleService().getVehicle(data.vehicleId);
    if (!vehicle) return JSON.stringify({ success: false, error: "Vehicle not found" });
    getVehicleService().parkVehicle(vehicle);
    return JSON.stringify({ success: true });
});