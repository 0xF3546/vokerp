import commandManager from "@server/core/foundation/CommandManager";
import { notify } from "@server/core/foundation/Utils";
import { Player } from "@server/core/player/impl/Player";

commandManager.add("veh", (player: Player, vehicleName: string) => {
    console.log(`Spawning vehicle ${vehicleName} for ${player.license}`);
    
    const vehicleHash = GetHashKey(vehicleName);
    if (!vehicleHash) {
        notify(player, "Invalid vehicle name");
        return;
    }

    const vehicle = CreateVehicle(vehicleHash, player.character.position.x, player.character.position.y, player.character.position.z, player.character.position.heading, true, true);
    if (!vehicle) {
        notify(player, "Failed to create vehicle");
        return;
    }

    const ped = player.getPed();
    if (!ped) {
        notify(player, "Failed to get player ped");
        return;
    }

    SetPedIntoVehicle(ped, vehicle, -1);
    console.log(`Vehicle ${vehicleName} spawned successfully for ${player.license}`);
});