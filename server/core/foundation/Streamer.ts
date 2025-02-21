import { Blip } from "@shared/types/Blip";
import { eventManager } from "./EventManager";
import { IStreamer } from "./IStreamer";
import { Player } from "../player/impl/Player";
import { PedDto } from "./PedDto";

class Streamer implements IStreamer {
    private blips: Blip[] = [];
    private peds: PedDto[] = [];

    createBlips(blips: Blip[]): void {
        this.blips.push(...blips);
        eventManager.emitClient("all", "Streamer::addBlips", JSON.stringify(blips));
    }

    createBlip(blip: Blip): void {
        console.log("Creating blip");
        blip.id = Math.random().toString(36).substring(7);
        this.blips.push(blip);
        eventManager.emitClient("all", "Streamer::addBlip", JSON.stringify(blip));
    }

    deleteBlip(blip: Blip): void {
        const index = this.blips.indexOf(blip);
        if (index > -1) {
            this.blips.splice(index, 1);
        }
    }

    getBlips(): Blip[] {
        return this.blips;
    }

    loadForPlayer(player: Player) {
        console.log("Loading blips for player");
        console.log(this.blips.length);
        eventManager.emitClient(player, "Streamer::LoadBlips", JSON.stringify(this.blips));
    }

    createPed(ped: PedDto): void {
        this.peds.push(ped);
        ped.handle = CreatePed(ped.pedType, GetHashKey(ped.model), ped.position.x, ped.position.y, ped.position.z, ped.position.heading, true, true);
    }
}

const streamer: IStreamer = new Streamer();

export const getStreamer = () => {
    if (!streamer) {
        throw new Error("Streamer is not initialized.");
    }
    return streamer;
}