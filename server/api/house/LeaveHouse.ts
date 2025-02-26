import { eventManager } from "@server/core/foundation/EventManager";
import { getHouseService } from "@server/core/gameplay/impl/HouseService";
import { getPlayerService } from "@server/core/player/impl/PlayerService";

eventManager.on("House::Leave", async (source, houseId) => {
    const player = getPlayerService().getBySource(source);
    const house = getHouseService().getHouseById(houseId);
    if (!house.isDoorOpen) return;
    house.isDoorOpen = true;
    player.character.position = house.basement.position;
    player.setVariable("houesId", undefined);
    player.setVariable("isInBasement", false);
    player.setVariable("isInHouse", false)
    player.setDimension(house.id);
    eventManager.emitWebView(source, "hideComponent", "house");
});