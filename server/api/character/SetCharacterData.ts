import { eventManager } from "@server/core/foundation/EventManager";
import { getPlayerService } from "@server/core/player/impl/PlayerService";
import { SetDataRequest } from "@shared/models/SetDataRequest";

eventManager.on('setCharacterData', async (source: number, data: string) => {
    const player = getPlayerService().getBySource(source);
    const charData: SetDataRequest = JSON.parse(data); 
    player.character.setData(charData.id, charData.val, charData.save);
});