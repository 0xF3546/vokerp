import { WEBVIEWS_WITHOUT_CURSOR } from "@shared/constants/WEBVIEWS_WITHOUT_CURSOR"
let events = 0;

export class EventManager {
    private events: Array<{ ev: string, func: Function }> = [];
    private debug: boolean;

    constructor() {
        this.events = [];
        this.debug = true;

        onNet("clientEvent", (...args) => {
            this.emit(...args);
        });

        onNet("webViewEvent", (event, ...args) => {
            this.emitWebView(event, args);
        })
    }

    emitServerPromise = (event, ...args: any[]): Promise<any> => {
        if (this.debug) console.log(`[EmitServerPromise::${event}]`);
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

    emitServer = (event: string, ...args: any[]): void => {
        events++;
        emitNet(event, ...args);

        if (this.debug) console.log(`[EmitServerEvent::${event}]`);
    }

    emitWebView = (event: string, ...args: any[]) => {
        if (!WEBVIEWS_WITHOUT_CURSOR.includes(event)) {
            if (event.toLowerCase() === "showcomponent") {
                SetNuiFocus(true, true);
            } else if (event.toLowerCase() === "hidecomponent") {
                SetNuiFocus(false, false);
            }
        }

        const isJSON = (obj: any): boolean => {
            try {
                JSON.parse(obj);
                return true;
            } catch (e) {
                return false;
            }
        };

        SendNUIMessage({
            event: event,
            args: isJSON(args) ? args : JSON.stringify(args)
        })
    }

    onWebView = (ev: string, func: (...args: any[]) => void): void => {
        RegisterRawNuiCallback(ev, (args: any) => {
            try {
                // Wenn args ein String ist, parsen wir ihn als JSON
                const requestBody = typeof args === 'string' ? JSON.parse(args) : args;

                // Extrahiere den `body` aus der Anfrage
                const body = requestBody.body;

                // Wenn der `body` ein JSON-String ist, parsen wir ihn
                const parsedBody = typeof body === 'string' ? JSON.parse(body) : body;

                // Logge die empfangenen Daten
                console.log(`[NUI::${ev}]`, parsedBody);

                // Wenn der geparste Body ein Array ist, verwenden wir ihn direkt
                // Andernfalls packen wir ihn in ein Array
                const argsArray = Array.isArray(parsedBody) ? parsedBody : [parsedBody];

                // Rufe die Callback-Funktion mit den Argumenten auf
                func(...argsArray);
            } catch (error) {
                console.error("Fehler beim Verarbeiten des NUI-Callbacks:", error);
            }
        });
    };

    onWebViewUnfiltered = (ev: string, func: Function): void => {
        RegisterNuiCallbackType(ev);
        on(`__cfx_nui:${ev}`, (data: any) => {
            console.log(`[NUI::${ev}]`, data);
            func(...data);
        });
    }

    onRawWebView = (ev: string, func: Function): void => {
        RegisterNuiCallbackType(ev);
        on(`__cfx_nui:${ev}`, func);
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
