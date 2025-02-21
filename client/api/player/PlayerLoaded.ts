import { Gender } from '@shared/enum/Gender';
import { LoadedPlayer } from '@shared/types/LoadedPlayer';
import { eventManager } from 'client/core/foundation/EventManager';
import { SpawnManager } from 'client/core/foundation/SpawnManager';
import { Delay } from 'client/core/foundation/Utils';

eventManager.on('playerLoaded', async (json: string) => {
    const data: LoadedPlayer = JSON.parse(json);
    const model = data.gender === Gender.MALE ? 1885233650 : -1667301416;
    RequestModel(model);
    while (!HasModelLoaded(model)) {
        await Delay(1);
    }
    SetPlayerModel(PlayerId(), model);
    SetModelAsNoLongerNeeded(model);
    globalThis.exports.spawnmanager.spawnPlayer({
        x: data.position.x,
        y: data.position.y,
        z: data.position.z,
        heading: data.position.heading,
        model: data.gender === Gender.MALE ? 'mp_m_freemode_01' : 'mp_f_freemode_01',
        skipFade: false
    });
    
    //SpawnManager.spawnPlayer(data.position);
})