import { eventManager } from "client/core/foundation/EventManager";

eventManager.onWebView("endCreator", () => {
    eventManager.emitWebView("hideComponent", "charcreator");
});