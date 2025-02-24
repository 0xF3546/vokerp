import commandManager from "@server/core/foundation/CommandManager";
import { Player } from "@server/core/player/impl/Player";
import { getVehicleService } from "@server/core/vehicle/impl/VehicleService";
import { VehicleShopExitPoint } from "@server/core/vehicle/impl/VehicleShopExitPoint";
import { VehicleShopVehicle } from "@server/core/vehicle/impl/VehicleShopVehicle";

commandManager.add("AddVehicleShopExitPoint", (player: Player, args) => {
    if (args.length < 1) {
        player.notify("", "Fehler: /AddVehicleShopExitPoint [VehicleShop]");
        return;
    }

    
    const vehicleShopId = parseInt(args[0]);

    const vehicleShop = getVehicleService().getVehicleShopById(vehicleShopId);

    if (!vehicleShop) {
        player.notify("", "Fahrzeugshop nicht gefunden.");
        return;
    }

    const vehicleShopExitPoint = new VehicleShopExitPoint();
    vehicleShopExitPoint.shopId = vehicleShopId;
    vehicleShopExitPoint.position = player.character.position;
    vehicleShopExitPoint.order = vehicleShop.exitPoints.length;

    vehicleShop.exitPoints.push(vehicleShopExitPoint);

    getVehicleService().updateVehicleShop(vehicleShop).then(() => {
        player.notify("", `Exitpunkt bei "${vehicleShop.name}" hinzugefügt.`);
    });
});