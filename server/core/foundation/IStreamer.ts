import { Blip } from "@shared/types/Blip";
import { Player } from "../player/impl/Player";
import { PedDto } from "./PedDto";

export type IStreamer = {
    createBlips(blips: Blip[]): void;
    createBlip(blip: Blip): void;
    deleteBlip(blip: Blip): void;
    getBlips(): Blip[];
    loadForPlayer(player: Player): void;
    createPed(ped: PedDto): void;
}