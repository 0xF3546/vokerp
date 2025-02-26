import { eventManager } from "client/core/foundation/EventManager";

eventManager.onRawWebView("Garage::GetNearest", async (data, cb) => {
    const d = await eventManager.emitServerPromise("Garage::GetNearest");
    cb(d);
});