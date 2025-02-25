import { eventManager } from "client/core/foundation/EventManager";

eventManager.on("Inventory::Show", () => {
    eventManager.emitWebView("showComponent", "inventory");
});