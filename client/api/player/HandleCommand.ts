import { eventManager } from "client/core/foundation/EventManager";

eventManager.onWebView("handleCommand", (args: string) => {
    console.log(args);
    const command = JSON.parse(args);
    console.log(command);
    ExecuteCommand(command.replace("/", ""));
    eventManager.emitWebView("hideComponent", "chat");
});