import { showChat } from "../Player/impl/Chat";
import { eventManager } from "./EventManager";
import { Delay, Keys } from "./Utils";

(async () => {
    while (true) {
        if (IsControlPressed(0, 245)) {
            showChat();
        }
        for (const key in Keys) {
            if (IsControlJustPressed(0, Keys[key])) {
                eventManager.emitServer(`KEY::${key}`);
            }
        }
        await Delay(1);
    }
})();

RegisterKeyMapping('inventory', 'Inventar öffnen', 'keyboard', 'I');