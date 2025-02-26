import { eventManager } from "@server/core/foundation/EventManager";
import { getHouseService } from "@server/core/gameplay/impl/HouseService";
import { getPlayerService } from "@server/core/player/impl/PlayerService";

eventManager.on("House::Enter", async (source, houseId) => {
    const player = getPlayerService().getBySource(source);
    const house = getHouseService().getHouseById(houseId);
    if (!house.isDoorOpen) return;
    house.isDoorOpen = true;
    player.character.position = house.interior.position;
    player.setDimension(house.id);
    player.setVariable("houseId", house.id);
    player.setVariable("isInHouse", true);

    eventManager.emitWebView(player, "hideComponent", "house");
});