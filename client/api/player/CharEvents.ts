import { eventManager } from "client/core/foundation/EventManager";
import { SetDataRequest } from "@shared/models/SetDataRequest";

eventManager.onWebView("setData", (data: string) => {
    const request: SetDataRequest = JSON.parse(data);
    if (request.save === undefined) request.save = false;
    eventManager.emitServer("setCharacterData", JSON.stringify(request));
});

eventManager.onWebView("setHeading", () => {
    SetEntityHeading(PlayerPedId(), 0.0);
});