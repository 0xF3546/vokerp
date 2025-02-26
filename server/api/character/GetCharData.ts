import { eventManager } from "@server/core/foundation/EventManager";
import { getPlayerService } from "@server/core/player/impl/PlayerService";
import { CharCreatorDto } from "@shared/models/CharCreatorDto";

eventManager.onCallback("Character::GetCharData", async (source: number) => {
    const player = getPlayerService().getBySource(source);
    if (!player) {
        return;
    }

    const creatorData: CharCreatorDto = {
        useCreator: player.character.firstname === null,
        data: player.character.data,
    }

    console.log(JSON.stringify(creatorData));

    return Promise.resolve(JSON.stringify(creatorData));
});