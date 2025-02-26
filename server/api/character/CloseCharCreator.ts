import { eventManager } from "@server/core/foundation/EventManager";
import { getPlayerService } from "@server/core/player/impl/PlayerService";

eventManager.on("CharCreator::Close", (source) => {
    const player = getPlayerService().getBySource(source);
    if (player.character.firstname === null) return;
    player.character.setCreator(false);
});