import commandManager from "@server/core/foundation/CommandManager";
import { notify } from "@server/core/foundation/Utils";
import { Player } from "@server/core/player/impl/Player";
import { Garage } from "@server/core/vehicle/impl/Garage";
import vehicleService, { getVehicleService } from "@server/core/vehicle/impl/VehicleService";

commandManager.add("addGarage", (player: Player, args) => {
    if (player.rank.permLevel < 100) return;
    if (args.length < 1) {
        return;
    }
    const garage = new Garage();
    garage.name = args;
    garage.position = player.character.position;
    garage.npc = 's_m_m_autoshop_01';

    getVehicleService().createGarage(garage);
    notify(player, "Garage erstellt");
});