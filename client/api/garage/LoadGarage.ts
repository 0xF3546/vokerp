import { eventManager } from "client/core/foundation/EventManager";

eventManager.onRawWebView("Garage::Load", async (data, cb) => {
    const d = await eventManager.emitServerPromise("Garage::Load");
    cb(d);
});
