import { eventManager } from "client/core/foundation/EventManager";

eventManager.onWebView("serverEvent", async (eventName: string, ...args: any[]) => {
    eventManager.emitServer(eventName, ...args);
});