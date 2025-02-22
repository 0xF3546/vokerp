import { Player } from "../player/impl/Player";
import { eventManager } from "./EventManager";

export const Delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
export const notify = (player: Player | Player[], title: string | null, message: string, color: string = "green", delay = 5000) => {
    const players = Array.isArray(player) ? player : [player];
    players.forEach((player) => {
        eventManager.emitWebView(player.source, "notification", JSON.stringify({ title, message, color, delay }));
    });
};