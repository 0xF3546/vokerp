import { eventManager } from "client/core/foundation/EventManager";

eventManager.onRawWebView("VehicleShop::Purchase", async (data, cb) => {
    const d = await eventManager.emitServerPromise("VehicleShop::Purchase", data);
    cb(d);
})