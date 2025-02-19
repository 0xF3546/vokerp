import { RadioState } from "./RadioState";

export type HudProps = {
    money: number;
    voiceRange: number;
    maxVoiceRange: number;
    isVoiceMuted: boolean;
    radioState: RadioState;
}