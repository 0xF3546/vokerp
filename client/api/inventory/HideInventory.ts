import { eventManager } from "client/core/foundation/EventManager";

eventManager.on("Inventory::Hide", () => {
    eventManager.emitWebView("hideComponent", "inventory");
});