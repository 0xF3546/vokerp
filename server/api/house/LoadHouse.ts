import { eventManager } from "@server/core/foundation/EventManager";
import { getHouseService } from "@server/core/gameplay/impl/HouseService";
import { getPlayerService } from "@server/core/player/impl/PlayerService";
import { HouseDto } from "@shared/models/HouseDto";

eventManager.onCallback("Houes::Load", async (source) => {
    const player = getPlayerService().getBySource(source);
    if (!player) return;

    let house;
    let h;
    if (player.getVariable("houseId") !== undefined) {
        house = getHouseService().getHouseById(player.getVariable("houseId"));
        h = house;
    } else {
        house = getHouseService().getNearestHouse(player.character.position);
        if (house.distance > 5) return;
        h = house.house;
    }

    const dto: HouseDto = {
        hasBasement: h.basementId !== null,
        hasGarage: h.garage,
        id: h.id,
        isDoorOpen: h.isDoorOpen,
        isOwner: h.ownerId === player.character.id,
        isTenant: h.tenants.some(t => t.characterId === player.character.id),
        maxTenants: h.maxTenants,
        price: h.price,
        tenants: h.tenants.map(t => ({
            id: t.id,
            name: 'Unknown',
            rent: t.rent
        })),
        isInside: player.getVariable("isInHouse") || player.getVariable("isInBasement"),
    }
    return JSON.stringify(dto);
});