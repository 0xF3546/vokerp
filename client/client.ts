import { Delay } from "./core/foundation/Utils";

const playerId = PlayerId();

while (true) {
  if (NetworkIsPlayerActive(playerId)) {
    //exports.spawnManager.setAutoSpawn(false);
    //exports['spawnManager'].setAutoSpawn(false);
    globalThis.exports.spawnmanager.setAutoSpawn(false);
    DoScreenFadeOut(0);
    Delay(500);
    emitNet('playerJoined');
    break;
  }
}