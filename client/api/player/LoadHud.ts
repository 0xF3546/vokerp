import { eventManager } from "client/core/foundation/EventManager";

eventManager.onRawWebView("loadHud", async (data, cb) => {
    const hud = await eventManager.emitServerPromise("loadHud");
    cb(hud);
});