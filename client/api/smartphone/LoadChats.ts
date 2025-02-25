import { eventManager } from "client/core/foundation/EventManager";

eventManager.onRawWebView("Smartphone::LoadChats", async (data, cb) => {
    const chats = await eventManager.emitServerPromise("Smartphone::LoadChats");
    cb(chats);
});