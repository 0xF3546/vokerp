import { eventManager } from "@server/core/foundation/EventManager";
import { Player } from "@server/core/player/impl/Player";

eventManager.on(`Shop::Close`, async (source) => {
    eventManager.emitWebView(source, `hideComponent`, 'shop');
});