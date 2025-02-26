import { eventManager } from "client/core/foundation/EventManager";

eventManager.onRawWebView("VehicleShop::Load", async (data, cb) => {
    const d = await eventManager.emitServerPromise("VehicleShop::Load");
    cb(d);
});
