import { eventManager } from "@server/core/foundation/EventManager";
import { getPlayerService } from "@server/core/player/impl/PlayerService";

eventManager.on('CharCreator::Change', async (source, data) => {
    const player = getPlayerService().getBySource(source);
    console.log(data);
    const [id, value] = JSON.parse(data);
    console.log(id, value);
    player.character.setData(id, value, true);
});