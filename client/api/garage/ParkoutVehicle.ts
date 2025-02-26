import { eventManager } from "client/core/foundation/EventManager";

eventManager.emitWebView("Garage::ParkoutVehicle", async (data, cb) => {
    const d = await eventManager.emitServerPromise("Garage::ParkoutVehicle", data);
    cb(d);
});