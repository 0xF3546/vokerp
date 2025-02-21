import { Blip } from "@shared/types/Blip";

export type IStreamer = {
    createBlip(blip: Blip): void;
    deleteBlip(id: string): void;
    getBlips(): Blip[];
}