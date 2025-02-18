import { eventManager } from "../../core/foundation/EventManager";

eventManager.on("Inventory::Hide", (player) => {
    eventManager.emitClient(player, "Inventory::Hide");
});