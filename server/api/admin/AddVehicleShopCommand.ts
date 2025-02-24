import commandManager from "@server/core/foundation/CommandManager";
import { getDistanceBetween } from "@server/core/foundation/Utils";
import { Player } from "@server/core/player/impl/Player";
import { getVehicleService } from "@server/core/vehicle/impl/VehicleService";
import { VehicleShop } from "@server/core/vehicle/impl/VehicleShop";

commandManager.add("addVehicleShop", (player: Player, args) => {
    if (args.length < 1) {
        player.notify("", "Fehler: /addvehicleshop [name]");
        return;
    }

    const g = getVehicleService().getNearestGarage(player.character.position);

    if (!g) {
        player.notify("", "Fehler: Keine Garage in der Nähe gefunden.");
        return;
    }

    if (g.distance > 90) {
        player.notify("", "Fehler: Du bist zu weit von der Garage entfernt.");
        return;
    }

    const name = args.join(" ");
    const shop = new VehicleShop();
    shop.name = name;
    shop.position = player.character.position;
    shop.garageId = g.Garage.id;

    getVehicleService().createVehicleShop(shop).then((shop) => {
        player.notify("", `Fahrzeugshop ${name} mit ID ${shop.id} erstellt (Garage ${g.Garage.name}).`);
    });
});