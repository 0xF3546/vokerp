import { eventManager } from "client/core/foundation/EventManager";

on('baseevents:onPlayerKilled', (killerID, deathData) => {
    const [x, y, z] = deathData.killerpos;
    console.log('died at:', { x, y, z });

    eventManager.emitServer('playerKilled', killerID, JSON.stringify(deathData));
 });
 