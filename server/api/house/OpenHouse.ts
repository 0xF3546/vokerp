import { eventManager } from "@server/core/foundation/EventManager";
import { getHouseService } from "@server/core/gameplay/impl/HouseService";
import { getPlayerService } from "@server/core/player/impl/PlayerService";

eventManager.on("House::Open", async (source, houseId) => {
    const player = getPlayerService().getBySource(source);
    const house = getHouseService().getHouseById(houseId);
    if (house.ownerId !== player.character.id && !house.isTenant(player.character.id)) return;
    if (!house) return;
    house.isDoorOpen = true;
});