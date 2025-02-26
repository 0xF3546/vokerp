import { eventManager } from "@server/core/foundation/EventManager";

eventManager.on("House::Close", async (source) => {
    eventManager.emitWebView(source, "hideComponent", "house");
});