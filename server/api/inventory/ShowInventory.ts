import { eventManager } from "@server/core/foundation/EventManager";

eventManager.on("Inventory::Show", (source) => {
    eventManager.emitClient(source, "Inventory::Show");
});