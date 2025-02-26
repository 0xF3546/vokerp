import { eventManager } from "client/core/foundation/EventManager";

eventManager.onRawWebView("Garage::GetParkout", async (data, cb) => {
    const d = await eventManager.emitServerPromise("Garage::GetParkout");
    cb(d);
});