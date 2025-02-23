import { eventManager } from "@server/core/foundation/EventManager";
import { getPlayerService } from "@server/core/player/impl/PlayerService";

eventManager.onCallback("loadHud", (source) => {
    const player = getPlayerService().getBySource(source);
    const data = {
        money: player.character.cash,
        voiceRange: 1,
        maxVoiceRange: 3,
        isVoiceMuted: true,
        radioState: 0
    }
    console.log(data);
    return JSON.stringify(data);
});