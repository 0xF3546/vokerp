import { eventManager } from "@server/core/foundation/EventManager";

eventManager.on("Bank::Close", async (source) => {
    eventManager.emitWebView(source, "hideComponent", "bank");
});