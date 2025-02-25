import { eventManager } from "../../core/foundation/EventManager";

eventManager.on("Inventory::Hide", (source) => {
    eventManager.emitClient(source, "Inventory::Hide");
});