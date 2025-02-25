import { eventManager } from "client/core/foundation/EventManager";

eventManager.onRawWebView("Inventory::Get", async (data, cb) => {
    const inventory = await eventManager.emitServerPromise("Inventory::Get");
    cb(inventory);
});