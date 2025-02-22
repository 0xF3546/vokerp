import { eventManager } from "client/core/foundation/EventManager";

eventManager.on("handleCommand", (command: string) => {
    ExecuteCommand(command);
});