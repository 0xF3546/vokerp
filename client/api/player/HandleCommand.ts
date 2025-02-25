import { eventManager } from "client/core/foundation/EventManager";
import { closeChat } from "client/core/Player/impl/Chat";

eventManager.onWebView("handleCommand", (command: string) => {
    ExecuteCommand(command.replace("/", ""));
    closeChat()
});