import { eventManager } from "@server/core/foundation/EventManager";
import { getPlayerService } from "@server/core/player/impl/PlayerService";
import { getVehicleService } from "@server/core/vehicle/impl/VehicleService";
import { GarageVehicleDto } from "@shared/models/GarageVehicleDto";

eventManager.onCallback(`Garage::GetParkout`, async (source) => {
    const player = getPlayerService().getBySource(source);
    if (!player) return;

    const garage = getVehicleService().getNearestGarage(player.character.position);
    if (!garage) return;
    if (garage.distance > 10) return;

    const dto: GarageVehicleDto[] = (await getVehicleService().findGarageVehicles(player.character.id, garage.Garage.id)).filter(x => x.parked).map((vehicle) => ({
        id: vehicle.id,
        name: vehicle.vehicleClass.displayName,
        isFavorite: vehicle.isFavorite,
        note: vehicle.notes,
    }))
    return await Promise.resolve(JSON.stringify(dto));
});
