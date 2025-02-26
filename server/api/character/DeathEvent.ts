import { eventManager } from "@server/core/foundation/EventManager";
import { getPlayerService } from "@server/core/player/impl/PlayerService";

eventManager.on('playerDeath', (source, type, coords) => {
    coords = JSON.parse(coords);
    const player = getPlayerService().getBySource(source);
    
    player.character.setDeath(true);
});