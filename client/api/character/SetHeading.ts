import { eventManager } from "client/core/foundation/EventManager";

eventManager.onWebView('setHeading', (args: string) => {
    const heading = JSON.parse(args);
    console.log('setHeading', heading);
    SetEntityHeading(PlayerPedId(), heading);
});