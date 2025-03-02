import commandManager from "@server/core/foundation/CommandManager";
import { Player } from "@server/core/player/impl/Player";
import { GarageExitpoint } from "@server/core/vehicle/impl/GarageExitpoint";
import { getVehicleService } from "@server/core/vehicle/impl/VehicleService";

commandManager.add("addGarageExitPoint", async (player: Player, args) => {
    if (player.rank.permLevel < 90) return;

    if (args.length !== 1) {
        player.notify(``, `Benutze: /addGarageExitPoint [GarageId]`, "error");
        return;
    }

    const garageId = parseInt(args[0]);
    if (!garageId) {
        player.notify(``, `Ungültige GarageId`, "error");
        return;
    }
    const garageExitPoint = new GarageExitpoint();
    garageExitPoint.garageId = garageId;
    garageExitPoint.position = player.character.position;
    getVehicleService().createGarageExitPoint(garageExitPoint);
    player.notify(``, `Garage Exitpoint hinzugefügt`, "success");
});