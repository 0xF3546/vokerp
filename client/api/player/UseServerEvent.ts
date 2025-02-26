import { eventManager } from "client/core/foundation/EventManager";

eventManager.onWebViewUnfiltered("ServerEvent", async (eventName: string, ...args: any[]) => {
    console.log(`Received server event: ${eventName}`, JSON.stringify(args));
    eventManager.emitServer(eventName, JSON.stringify(args));
});