import { Player } from "../player/impl/Player";
import { eventManager } from "./EventManager";

export const Delay = (ms: number) => new Promise((res) => setTimeout(() => res, ms));
export const notify = (player: Player | Player[], message: string, color: string = "green", delay = 5000) => {
    const players = Array.isArray(player) ? player : [player];
    players.forEach((player) => {
        eventManager.emitClient(player.source, "notify", message, color, delay);
    });
};