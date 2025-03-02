import { eventManager } from "client/core/foundation/EventManager";

eventManager.onRawWebView("Garage::ParkVehicle", async (data, cb) => {
    const d = await eventManager.emitServerPromise("Garage::ParkVehicle", data);
    cb(d);
});