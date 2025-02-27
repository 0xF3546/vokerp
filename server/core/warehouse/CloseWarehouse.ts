import { eventManager } from "../foundation/EventManager";
import { getPlayerService } from "../player/impl/PlayerService";

eventManager.on("Warehouse::Close", (source) => {
    const player = getPlayerService().getBySource(source);
    if (!player) return;
    eventManager.emitWebView(player, "hideComponent", "warehouse");
});