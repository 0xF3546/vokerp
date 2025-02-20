import { Gender } from '@shared/enum/Gender';
import { LoadedPlayer } from '@shared/types/LoadedPlayer';

onNet('playerLoaded', (json: string) => {
    const data: LoadedPlayer = JSON.parse(json);
    SetPlayerModel(PlayerId(), (data.gender === Gender.MALE ? 1885233650 : -1667301416));
})