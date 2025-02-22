import { Position } from "@shared/types/Position";
import { Delay } from "./Utils";

export class SpawnManager {
    static spawnPlayer = async (position: Position) => {
        const ped = PlayerPedId();
        FreezeEntityPosition(ped, true);
        if (ped === 0 || ped === -1) {
            console.error("Fehler: PlayerPedId ist ungültig!");
            return;
        }

        console.log(`Spawning player at position: ${JSON.stringify(position)}`);

        RequestCollisionAtCoord(position.x, position.y, position.z);
        
        let startTime = GetGameTimer();
        while (!HasCollisionLoadedAroundEntity(ped)) {
            if (GetGameTimer() - startTime >= 5000) {
                console.error("Fehler: Kollision konnte nicht geladen werden, breche Spawn-Vorgang ab!");
                return;
            }
            await Delay(1);
        }

        console.log("Collision loaded!");
        

        if (!HasCollisionLoadedAroundEntity(ped)) {
            console.error("Fehler: Kollision konnte nicht geladen werden!");
            return;
        }

        if (IsEntityDead(ped)) {
            NetworkResurrectLocalPlayer(position.x, position.y, position.z, position.heading, true, true);
        }
        
        //SetEntityCoordsNoOffset(ped, position.x, position.y, position.z, false, false, false);
        SetEntityCoords(ped, position.x, position.y, position.z, false, false, false, false);
        SetEntityHeading(ped, position.heading);
        
        ClearPedTasksImmediately(ped);
        ClearPlayerWantedLevel(PlayerId());
        RemoveAllPedWeapons(ped, true);

        FreezeEntityPosition(ped, false);
        console.log("Player spawned!");
        emit('playerSpawned', position);
    }
}
