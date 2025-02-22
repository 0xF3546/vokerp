import { eventManager } from "./EventManager";
import { Delay } from "./Utils";

(async () => {
    while (true) {
        if (IsControlPressed(0, 245)) {
            eventManager.emitWebView('showComponent', 'chat');
        }
        await Delay(1);
    }
})();