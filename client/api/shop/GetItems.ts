import { eventManager } from "client/core/foundation/EventManager";

eventManager.onRawWebView(`Shop::GetItems`, async (data, cb) => {
    const d = await eventManager.emitServerPromise(`Shop::GetItems`);
    cb(d);
});