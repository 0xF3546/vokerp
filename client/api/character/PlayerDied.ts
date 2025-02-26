import { eventManager } from "client/core/foundation/EventManager";

on('baseevents:onPlayerDied', (killerType, deathCoords) => {
    const [x, y, z] = deathCoords;
    console.log('died at:', { x, y, z });
    SetEntityHealth(PlayerPedId(), 100);

    eventManager.emitServer('playerDeath', killerType, JSON.stringify(deathCoords));
 });