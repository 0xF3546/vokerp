import { eventManager } from "@server/core/foundation/EventManager";
import { getGamePlay } from "@server/core/gameplay/impl/Gameplay";
import { Player } from "@server/core/player/impl/Player";
import { getPlayerService } from "@server/core/player/impl/PlayerService";
import { getVehicleService } from "@server/core/vehicle/impl/VehicleService";
import { GarageDto } from "@shared/models/GarageDto";

eventManager.onCallback(`Garage::Load`, async (source) => {
    const player = getPlayerService().getBySource(source);
    if (!player) return;

    const garage = getVehicleService().getNearestGarage(player.character.position);
    if (!garage) return;
    if (garage.distance > 10) return;

    const dto: GarageDto = {
        name: garage.Garage.name,
        type: garage.Garage.type
    }
    return JSON.stringify(dto);
});
