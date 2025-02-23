import { eventManager } from "client/core/foundation/EventManager";
import { player } from "client/core/Player/impl/Player";

eventManager.on("Administrator::Aduty", (state: boolean) => {
    player.aduty = state;
});