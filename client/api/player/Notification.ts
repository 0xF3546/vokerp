import { eventManager } from "client/core/foundation/EventManager";
import { notify } from "client/core/foundation/Utils";

eventManager.on("notification", (args: string) => {
    const { title, message, color, delay } = JSON.parse(args);
    notify(title, message, color, delay);
});