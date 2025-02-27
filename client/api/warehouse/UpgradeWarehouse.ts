import { eventManager } from "client/core/foundation/EventManager";

eventManager.onRawWebView("Warehouse::Upgrade", async (data, cb) => {
    const d = await eventManager.emitServerPromise("Warehouse::Upgrade");
    cb(d);
});