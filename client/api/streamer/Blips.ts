import { eventManager } from "client/core/foundation/EventManager";
import { Blip } from "@shared/types/Blip";
import { streamer } from "client/core/foundation/Streamer";

eventManager.on("Streamer::LoadBlips", (blips: string) => {
    const blipArray: Blip[] = JSON.parse(blips);
    blipArray.forEach(blip => {
        streamer.createBlip(blip);
    });
});

eventManager.on("Streamer::addBlip", (blip) => {
    streamer.createBlip(JSON.parse(blip));
});

eventManager.on("Streamer::removeBlip", (id) => {
    streamer.deleteBlip(id);
});

eventManager.on("Streamer::addBlips", (blips) => {
    blips = JSON.parse(blips);

    for (let blip of blips) {
        streamer.createBlip(blip);
    }
});

eventManager.on("Streamer::removeBlips", (blips) => {
    blips = JSON.parse(blips);

    for (let blip of blips) {
        streamer.deleteBlip(blip.id);
    }
});