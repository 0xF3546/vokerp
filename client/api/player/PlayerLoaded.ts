import { Gender } from '@shared/enum/Gender';
import { LoadedPlayer } from '@shared/types/LoadedPlayer';
import { eventManager } from 'client/core/foundation/EventManager';
import { SpawnManager } from 'client/core/foundation/SpawnManager';
import { Delay } from 'client/core/foundation/Utils';

eventManager.on('playerLoaded', async (json: string) => {
    const data: LoadedPlayer = JSON.parse(json);
    const model = data.gender === Gender.MALE ? 'mp_m_freemode_01' : 'mp_f_freemode_01';
    const hashKey = GetHashKey(model);

    RequestModel(hashKey);
    while (!HasModelLoaded(hashKey)) {
        RequestModel(hashKey);
        await Delay(1);
    }

    globalThis.exports.spawnmanager.spawnPlayer({
        x: data.position.x,
        y: data.position.y,
        z: data.position.z,
        heading: data.position.heading,
        model: model,
        skipFade: false
    })
    
    const playerPed = PlayerPedId();
    SetPlayerModel(PlayerId(), hashKey);
    SetModelAsNoLongerNeeded(hashKey);
    
    // Reinitialize the player ped
    SetPedDefaultComponentVariation(playerPed);
    SetPedComponentVariation(playerPed, 0, 0, 0, 2); // Set a default component variation
});