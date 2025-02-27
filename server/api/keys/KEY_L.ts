import { eventManager } from "@server/core/foundation/EventManager";
import { Player } from "@server/core/player/impl/Player";
import { getPlayerService } from "@server/core/player/impl/PlayerService";
import { getVehicleService } from "@server/core/vehicle/impl/VehicleService";

eventManager.on('KEY::L', async (source: number) => {
    const player: Player = getPlayerService().getBySource(source);

    getVehicleService().getNearestCharacterVehicles(player.character).forEach(vehicle => {
        if (vehicle.charId === player.character.id) {
            vehicle.locked = !vehicle.locked;
            if (vehicle.locked) {
                player.notify(`${vehicle.vehicleClass.displayName} (${vehicle.id})`, "Du hast das Fahrzeug abgeschlossen", "error");
            } else {
                player.notify(`${vehicle.vehicleClass.displayName} (${vehicle.id})`, "Du hast das Fahrzeug aufgeschlossen", "success");
            }
            return;
        }
    });
});