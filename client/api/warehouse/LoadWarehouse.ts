import { eventManager } from "client/core/foundation/EventManager";

eventManager.onRawWebView("Warehouse::Load", async (data, cb) => {
    const d = await eventManager.emitServerPromise("Warehouse::Load");
    cb(d);
});