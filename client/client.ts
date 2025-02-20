import { Delay } from "./core/foundation/Utils";

const playerId = PlayerId();

while (true) {
  if (NetworkIsPlayerActive(playerId)) {
    DoScreenFadeOut(0);
    Delay(500);
    emitNet('playerJoined');
    break;
  }
}