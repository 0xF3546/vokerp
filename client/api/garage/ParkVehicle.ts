import { eventManager } from "client/core/foundation/EventManager";

eventManager.emitWebView("Garage::ParkVehicle", async (data, cb) => {
    const d = await eventManager.emitServerPromise("Garage::ParkVehicle", data);
    cb(d);
});