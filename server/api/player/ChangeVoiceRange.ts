import { eventManager } from "@server/core/foundation/EventManager";
import { getPlayerService } from "@server/core/player/impl/PlayerService";

eventManager.onCallback("player::ChangeVoiceRange", (source, range: number | undefined) => {
    const player = getPlayerService().getBySource(source);
    return player.setVoiceRange(range);
});