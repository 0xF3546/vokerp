import { Position } from "@shared/types/Position";
import { Player } from "../player/impl/Player";
import { getPlayerService } from "../player/impl/PlayerService";
import { eventManager } from "./EventManager";

export const Delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
export const notify = (player: Player | Player[], title: string | null, message: string, color: string = "green", delay = 5000) => {
    const players = Array.isArray(player) ? player : [player];
    players.forEach((player) => {
        eventManager.emitWebView(player.source, "notification", JSON.stringify({ title, message, color, delay }));
    });
};

const broadcast = (title: string, message: string, color: string = "green", delay = 5000, players: string | Player[] = 'all') => {
    const playerList = Array.isArray(players) ? players : getPlayerService().getPlayers();
    playerList.forEach((player) => {
        eventManager.emitWebView(player.source, "broadcast", JSON.stringify({ title, message, color, delay }));
    });

}

export const notifications = {
    sendTeamNotification: (title: string, message: string, color: string = "green", delay = 5000) => {
        getPlayerService().getPlayers().forEach((player) => {
            if (player.rank.permLevel >= 50) {
                notify(player, title, message, color, delay);
            }
        });
    },

    sendFactionNotification: (factionId: number, title: string, message: string, color: string = "green", delay = 5000) => {
        getPlayerService().getPlayers().forEach((player) => {
            if (player.character.factionId === factionId) {
                notify(player, title, message, color, delay);
            }
        });
    },

    sendBroadcast: (title: string, message: string, color: string = "green", delay = 5000, players: string | Player[] = 'all') => {
        broadcast(title, message, color, delay, players);
    }
}

export const getDistanceBetween = (pos1: Position, pos2: Position): number => {
    return Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2) + Math.pow(pos1.z - pos2.z, 2));
}