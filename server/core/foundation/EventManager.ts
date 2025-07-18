import { Player } from "../player/impl/Player";

class EventManager {
    private debug: boolean;

    constructor() {
        this.debug = true;
    }

    on(ev: string, func: (source: number, ...args: any[]) => void): void {
        onNet(ev, (...args) => {
            const source = global.source;
            func(source, ...args);
        });
    }

    onCallback(ev: string, func: (source: number, ...args: any[]) => any): void {
        onNet(ev, async (...args) => {
            const source = global.source;
            const result = await func(source, ...args);
            if (result) {
                emitNet(ev + "::Callback", source, result);
            }
        });
    }

    emitClient(player: number | Player | string, event: string, ...args: any[]): void {

        if (player == null) return;
    
        if (player instanceof Player) player = player.source;
    
        // Wenn "all" als Player angegeben ist, sende an alle
        if (player === "all") {
            emitNet(event, -1, ...args);
            if (this.debug) console.log(`[EmitClientEvent::ALL::${event}]`);
        } else {
            if (this.debug) console.log(`Player Entity for ID ${player}: ${player}`);
            if (player !== "0") {
                emitNet(event, player, ...args);
                if (this.debug) console.log(`[EmitClientEvent::${GetPlayerName(player.toString())}::${event}]`);
            } else {
                if (this.debug) console.error(`emitClient Error: Player undefined or Invalid: ${player}, ${event}`);
            }
        }
    }

    // Methode zum Behandeln von Events, die vom Client empfangen werden
    emitFromClient(...args: any[]): void {
        throw new Error("Method not implemented.");
    }

    emit = (player: number | Player, event: string, ...args: any[]): void => {
        if (player instanceof Player) player = player.source;
        emit(event, player, ...args);
        if (this.debug) console.log(`[EmitEvent::${GetPlayerName(player.toString())}::${event}]`);
    }

    emitWebView = (player: number | Player, event: string, ...args: any[]): void => {
        if (player instanceof Player) player = player.source;
        emitNet("webViewEvent", player, event, ...args);
    }
}

export const eventManager = new EventManager();

export default {
    eventManager
};
