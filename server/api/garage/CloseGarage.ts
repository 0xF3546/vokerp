import { eventManager } from "@server/core/foundation/EventManager";

eventManager.on(`Garage::Close`, async (source) => {
    eventManager.emitWebView(source, "hideComponent", "garage");
});