import commandManager from "@server/core/foundation/CommandManager";
import { notify } from "@server/core/foundation/Utils";
import { Player } from "@server/core/player/impl/Player";

commandManager.add("veh", (player: Player, vehicleName: string) => {
    console.log(`Spawning vehicle ${vehicleName} for ${player.license}`);
    
    const vehicleHash = GetHashKey(vehicleName);
    if (!vehicleHash) {
        player.notify("", "Invalid vehicle name", "red");
        return;
    }

    const vehicle = CreateVehicle(vehicleHash, player.character.position.x, player.character.position.y, player.character.position.z, player.character.position.heading, true, true);
    if (!vehicle) {
        player.notify("", "Failed to create vehicle", "red");
        return;
    }

    const ped = player.getPed();
    if (!ped) {
        player.notify("", "Failed to get player ped", "red");
        return;
    }

    SetPedIntoVehicle(ped, vehicle, -1);
    console.log(`Vehicle ${vehicleName} spawned successfully for ${player.license}`);
});