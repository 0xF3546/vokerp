import { eventManager } from "client/core/foundation/EventManager";

eventManager.onRawWebView("Houes::Load", async (data, cb) => {
    const d = await eventManager.emitServerPromise("House::Load")
    cb(d)
})