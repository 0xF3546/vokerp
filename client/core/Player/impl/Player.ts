import { Character } from "client/core/character/impl/Character";
import { eventManager } from "client/core/foundation/EventManager";
import { VOICE_RANGES } from "@shared/constants/VOICE_RANGES";

export class Player {
    character!: Character;

    private playerAduty: boolean = false;
    noClip: boolean = false;

    isDead: boolean = false;
    private playerVoiceRange: number = 1;

    constructor(character) {
        this.character = character;
    }

    set aduty(aduty: boolean) {
        this.playerAduty = aduty;
    }

    get aduty() {
        return this.playerAduty;
    }

    get ped() {
        return PlayerPedId();
    }

    get voiceRange() {
        return this.playerVoiceRange;
    }

    setVoiceRange = async (range: number, sync: boolean = true): Promise<number> => {
        if (sync) {
            this.playerVoiceRange = await eventManager.emitServerPromise("player::ChangeVoiceRange", range)
        } else {
            this.playerVoiceRange = range;
        }
        eventManager.emitWebView("player::VoiceRangeChanged", JSON.stringify(VOICE_RANGES[this.playerVoiceRange]));
        return this.playerVoiceRange;
    }

    setVariable = (key: string, value: any) => {
        GetPlayer(PlayerPedId()).state[key] = value;
    }

    getVariable = (key: string) => {
        return GetPlayer(PlayerPedId()).state[key];
    }
}

export let player: Player = new Player(new Character());