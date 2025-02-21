let events = 0;

export class EventManager {
    private events: Array<{ ev: string, func: Function }> = [];
    private debug: boolean = false;

    constructor() {
        this.events = [];
        this.debug = false;

        onNet("clientEvent", (...args) => {
            this.emit(...args);
        });

        onNet("webViewEvent", (event, ...args) => {
            this.emitWebView(event, args);
        })
    }

    emitServerPromise = (event, ...args: any[]): Promise<any> => {
        return new Promise((resolve, reject) => {
            this.emitServer(event, ...args);

            this.on(`${event}::Callback`, (...callbackArgs: any[]) => {
                resolve(callbackArgs);
            });
        });
    }

    on = (ev: string, func: Function): void => {
        onNet(ev, func);
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

    emitServer = (event, ...args: any[]): void => {
        events++;
        emitNet(event, ...args);

        if (this.debug) console.log(`[EmitServerEvent::${args[0]}]`);
    }

    emitWebView = (event: string, ...args: any[]) => {
        SendNUIMessage({
            event: event,
            args: args
        })
    }

    onWebView = (ev: string, func: Function): void => {
        RegisterRawNuiCallback(ev, func);
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
