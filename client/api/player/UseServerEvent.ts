import { eventManager } from "client/core/foundation/EventManager";

eventManager.onWebView("ServerEvent", async (eventName: string, ...args: any[]) => {
    eventManager.emitServer(eventName, JSON.stringify(args));
});