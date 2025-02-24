import commandManager from "@server/core/foundation/CommandManager";
import { Player } from "@server/core/player/impl/Player";
import { getVehicleService } from "@server/core/vehicle/impl/VehicleService";
import { VehicleShop } from "@server/core/vehicle/impl/VehicleShop";

commandManager.add("addVehicleShop", (player: Player, args) => {
    if (args.length < 1) {
        player.notify("", "Fehler: /addvehicleshop [name]");
        return;
    }

    const name = args.join(" ");
    const shop = new VehicleShop();
    shop.name = name;
    shop.position = player.character.position;

    getVehicleService().createVehicleShop(shop).then((shop) => {
        player.notify("", `Fahrzeugshop ${name} mit ID ${shop.id} erstellt.`);
    });
});