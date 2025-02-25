import { eventManager } from "client/core/foundation/EventManager";

eventManager.onRawWebView("Smartphone::LoadChatMessages", async (data, cb) => {
    const messages = await eventManager.emitServerPromise("Smartphone::LoadChatMessages", data.chatId);
    cb(messages);
});