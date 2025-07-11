import commandManager from "@server/core/foundation/CommandManager";
import { notify } from "@server/core/foundation/Utils";
import { Player } from "@server/core/player/impl/Player";
import { Garage } from "@server/core/vehicle/impl/Garage";
import { getVehicleService } from "@server/core/vehicle/impl/VehicleService";

commandManager.add("addGarage", (player: Player, args) => {
    if (player.rank.permLevel < 100) return;
    if (args.length < 1) {
        return;
    }
    console.log(args);
    const garage = new Garage();
    garage.name = args.join(" "); // Array in einen String umwandeln
    garage.position = player.character.position;
    garage.npc = 's_m_m_autoshop_01';

    getVehicleService().createGarage(garage);
    player.notify("", "Garage erstellt", "green");
});
