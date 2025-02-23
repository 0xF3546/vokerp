import { eventManager } from "client/core/foundation/EventManager";

eventManager.onRawWebView("loadHud", async (data, cb) => {
    console.log(data);
    console.log(cb);
    const hud = await eventManager.emitServerPromise("loadHud");
    console.log(hud);
    cb(hud);
});