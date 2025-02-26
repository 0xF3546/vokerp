import { eventManager } from "@server/core/foundation/EventManager";
import { getGamePlay } from "@server/core/gameplay/impl/Gameplay";
import { Player } from "@server/core/player/impl/Player";
import { getPlayerService } from "@server/core/player/impl/PlayerService";
import { getVehicleService } from "@server/core/vehicle/impl/VehicleService";
import { GarageVehicleDto } from "@shared/models/GarageVehicleDto";

eventManager.onCallback(`Garage::GetNearest`, (source) => {
    const player = getPlayerService().getBySource(source);
    if (!player) return;

    const garage = getVehicleService().getNearestGarage(player.character.position);
    if (!garage) return;
    if (garage.distance > 10) return;

    const dto: GarageVehicleDto[] = getVehicleService().getNearestCharacterVehicles(player.character).map((vehicle) => ({
        id: vehicle.id,
        name: vehicle.vehicleClass.displayName,
        isFavorite: vehicle.isFavorite,
        note: vehicle.notes,
    }))
    return JSON.stringify(dto);
});
