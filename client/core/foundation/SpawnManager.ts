import { Position } from "@shared/types/Position";
import { Delay } from "./Utils";

export class SpawnManager {
    static spawnPlayer = async (position: Position) => {
        const ped = PlayerPedId();
        if (ped === 0 || ped === -1) {
            console.error("Fehler: PlayerPedId ist ungültig!");
            return;
        }

        RequestCollisionAtCoord(position.x, position.y, position.z);
        
        // Warten auf Kollision (max. 5 Sekunden)
        let startTime = GetGameTimer();
        while (!HasCollisionLoadedAroundEntity(ped) && (GetGameTimer() - startTime) < 5000) {
            await Delay(1);
        }

        // Spieler wiederbeleben, falls tot
        if (IsEntityDead(ped)) {
            NetworkResurrectLocalPlayer(position.x, position.y, position.z, position.heading, true, true);
        }
        
        FreezeEntityPosition(ped, true);  // Physik deaktivieren
        SetEntityCoordsNoOffset(ped, position.x, position.y, position.z, false, false, false);
        FreezeEntityPosition(ped, false); // Physik wieder aktivieren
        
        
        // Spieler aufräumen
        ClearPedTasksImmediately(ped);
        ClearPlayerWantedLevel(PlayerId());
        RemoveAllPedWeapons(ped, true);

        emit('playerSpawned', position);
    }
}
