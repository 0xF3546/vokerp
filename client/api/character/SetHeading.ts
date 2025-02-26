import { eventManager } from "client/core/foundation/EventManager";

eventManager.onWebViewUnfiltered('setHeading', (args: string) => {
    const heading = JSON.parse(args)[0];
    console.log('setHeading', heading);
    SetEntityHeading(PlayerPedId(), heading);
});