import { eventManager } from "client/core/foundation/EventManager";

eventManager.onRawWebView("Bank::Load", async (data, cb) => {
    const d = await eventManager.emitServerPromise("Bank::Load");
    cb(d);
})