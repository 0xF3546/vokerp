import { eventManager } from "client/core/foundation/EventManager";
import { closeChat } from "client/core/Player/impl/Chat";

eventManager.onWebView("handleCommand", (args: string) => {
    console.log(args);
    const command = JSON.parse(args);
    console.log(command);
    ExecuteCommand(command.replace("/", ""));
    closeChat()
});