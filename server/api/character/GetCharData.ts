import { eventManager } from "@server/core/foundation/EventManager";
import { getPlayerService } from "@server/core/player/impl/PlayerService";
import { CharCreatorDto } from "@shared/models/CharCreatorDto";

eventManager.onCallback("Character::GetCharData", async (source: number) => {
    const player = getPlayerService().getBySource(source);
    if (!player) {
        return;
    }

    const creatorData: CharCreatorDto = {
        useCreator: player.character.firstname === "",
        data: JSON.stringify(player.character.data),
    }

    return JSON.stringify(creatorData);
});