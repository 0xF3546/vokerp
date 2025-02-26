import { eventManager } from "@server/core/foundation/EventManager";

eventManager.on("VehicleShop::Close", async (source) => {
    eventManager.emitWebView(source, "hideComponent", "vehicleshop");
});