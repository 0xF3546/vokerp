import playerService from "../player/impl/PlayerService";

class EventManager {
    private debug: boolean;
    private events: Array<{ ev: string, func: Function }> = [];

    constructor() {
        this.debug = true;
        this.events = [];

        onNet("serverEvent", (...args: any[]) => {
            if (this.debug) console.debug(`SE: ${args}`);
            const player = playerService.getBySource(args[0]);
            if (player != null) args[0] = player;
            this.emitFromClient(...args);
        });
    }

    // Methode zum Registrieren eines Events
    on(ev: string, func: Function): void {
        this.events.push({
            ev: ev,
            func: func
        });
    }

    // Methode zum Senden von Events an den Client
    emitClient(...args: any[]): void {
        const player = args[0];

        if (player == null) return;

        args.splice(0, 1);

        // Wenn "all" als Player angegeben ist, sende an alle
        if (player === "all") {
            const playerList = getPlayers();

            for (const playerId of playerList) {
                const playerEntity = GetPlayerFromIndex(parseInt(playerId));
                if (playerEntity) {
                    emitNet("clientEvent", playerEntity, ...args);
                }
            }

            if (this.debug) console.log(`[EmitClientEvent::ALL::${args[0]}]`);
        } else {
            const playerEntity = GetPlayerFromIndex(player);
            if (playerEntity) {
                emitNet("clientEvent", playerEntity, ...args);
                if (this.debug) console.log(`[EmitClientEvent::${GetPlayerName(player)}::${args[0]}]`);
            } else {
                if (this.debug) console.error(`emitClient Error: Player undefined or Invalid: ${player}, ${args[0]}`);
            }
        }
    }

    // Methode zum Behandeln von Events, die vom Client empfangen werden
    emitFromClient(...args: any[]): void {
        const event = this.events.find(e => e.ev === args[1]);

        if (!event) return;

        const ev = args[1];

        // Argumente anpassen
        args[1] = args[0];
        args.splice(0, 1);

        // Event ausführen
        for (const e of this.events) {
            if (e.ev === event.ev) {
                e.func(...args);
            }
        }
    }

    // Methode zur Überprüfung der Gültigkeit eines Events
    isValid(ev: string): boolean {
        const event = this.events.find(e => e.ev === ev);
        return event !== undefined;
    }

    // Methode zum Auslösen eines Events
    emit(...args: any[]): void {
        const event = this.events.find(e => e.ev === args[0]);

        if (!event) return;

        const ev = args[0];

        args.splice(0, 1);

        // Event ausführen
        for (const e of this.events) {
            if (e.ev === event.ev) {
                e.func(...args);
            }
        }

        if (this.debug) console.log(`[EmitEvent::${ev}]`);
    }

    emitWebView = (player, event: string, ...args: any[]): void => {
        emitNet("webViewEvent", player, event, ...args);
    }
}

export const eventManager = new EventManager();

export default {
    eventManager
};
