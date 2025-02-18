let events = 0;

export class EventManager {
    private events: Array<{ ev: string, func: Function }> = [];
    private debug: boolean = false;

    constructor() {
        this.events = [];
        this.debug = false;

        on("clientEvent", (...args) => {
            this.emit(...args);
        });
    }

    emitServerPromise = (...args: any[]): Promise<any> => {
        return new Promise((resolve, reject) => {
            this.emitServer(...args);

            this.on(`${args[0]}::Callback`, (...callbackArgs: any[]) => {
                resolve(callbackArgs);
                this.off(`${args[0]}::Callback`);
            });
        });
    }

    off = (ev: string): void => {
        const index = this.events.findIndex(e => e.ev === ev);

        if (index !== -1) {
            this.events.splice(index, 1);
        }
    }

    on = (ev: string, func: Function): void => {
        this.events.push({
            ev: ev,
            func: func
        });
    }

    emit = (...args: any[]): void => {
        const ev = args[0];
        args.splice(0, 1);

        const event = this.events.find(e => e.ev === ev);

        if (!event) return;

        // Event-Handler ausführen
        for (const e of this.events) {
            if (e.ev === event.ev) {
                e.func(...args);
            }
        }

        if (this.debug) console.log(`[EmitEvent::${ev}]`);
    }

    emitServer = (...args: any[]): void => {
        events++;
        emitNet("serverEvent", ...args);

        if (this.debug) console.log(`[EmitServerEvent::${args[0]}]`);
    }
}

export function load(): void {
    setInterval(() => {
        if (events > 60) {
        }
        events = 0;
    }, 30000);
}

export const eventManager = new EventManager();

export default {
    load,
    eventManager
};
