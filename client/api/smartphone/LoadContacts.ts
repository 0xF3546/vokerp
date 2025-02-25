import { eventManager } from "client/core/foundation/EventManager";

eventManager.onRawWebView("Smartphone::LoadContacts", async (data, cb) => {
    const contacts = await eventManager.emitServerPromise("Smartphone::LoadContacts");
    cb(contacts);
});