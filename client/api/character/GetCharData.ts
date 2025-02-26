import { eventManager } from "client/core/foundation/EventManager";

eventManager.onRawWebView("Character::GetCharData", async (data, cb) => {
    const d = await eventManager.emitServerPromise("Character::GetCharData");
    console.log("Received character data:", d);	
    cb(d);
});