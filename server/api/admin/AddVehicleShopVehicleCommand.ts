import commandManager from "@server/core/foundation/CommandManager";
import { Player } from "@server/core/player/impl/Player";
import { getVehicleService } from "@server/core/vehicle/impl/VehicleService";
import { VehicleShopVehicle } from "@server/core/vehicle/impl/VehicleShopVehicle";

commandManager.add("addVehicleShopVehicle", async (player: Player, args) => {
    if (args.length < 3) {
        player.notify("", "Fehler: /addvehicleshop [VehicleClassId] [VehicleShop] [Preis]");
        return;
    }
    
    const vehicleClassId = parseInt(args[0]);
    const vehicleShopId = parseInt(args[1]);
    const price = parseInt(args[2]);

    const vehicleShop = getVehicleService().getVehicleShopById(vehicleShopId);

    if (!vehicleShop) {
        player.notify("", "Fahrzeugshop nicht gefunden.");
        return;
    }

    const vehicleClass = getVehicleService().getClassById(vehicleClassId);

    if (!vehicleClass) {
        player.notify("", "Fahrzeugklasse nicht gefunden.");
        return;
    }

    const vehicleShopVehicle = new VehicleShopVehicle();
    vehicleShopVehicle.shopId = vehicleShopId;
    vehicleShopVehicle.vehicleClass = vehicleClassId;
    vehicleShopVehicle.price = price;
    vehicleShopVehicle.position = player.character.position;

    vehicleShop.vehicles.push(vehicleShopVehicle);
    if (await getVehicleService().createVehicleShopVehicle(vehicleShopVehicle) === null)
        player.notify("", `Es gab ein Fehler beim speichern des Fahrzeuges." hinzugefügt.`);
    else 
        player.notify("", `Fahrzeugklasse ${vehicleClass.displayName} für ${vehicleShopVehicle.price} bei "${vehicleShop.name}" hinzugefügt.`);
});