import { eventManager } from "@server/core/foundation/EventManager";
import { getPlayerService } from "@server/core/player/impl/PlayerService";
import { CharCreatorDto } from "@shared/models/CharCreatorDto";

eventManager.on("CharCreator::Submit", (source, data) => {
    const player = getPlayerService().getBySource(source);
    const dataParsed: CharCreatorDto = JSON.parse(data);
    player.character.setCreator(false, dataParsed, true);
});