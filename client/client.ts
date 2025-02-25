import { eventManager } from "./core/foundation/EventManager";
import { Delay } from "./core/foundation/Utils";

console.log('eventManager:', eventManager); // Debug-Ausgabe

const playerId = PlayerId();

(async () => {
  while (true) {
    if (NetworkIsPlayerActive(playerId)) {
      // Überprüfe, ob der spawnmanager verfügbar ist
      /*if (globalThis.exports.spawnmanager) {
        console.log('Disabling auto-spawn...');
        globalThis.exports.spawnmanager.setAutoSpawn(false);
        console.log('Disabled auto-spawn!');
      } else {
        console.error('spawnmanager is NOT available');
      }*/

      console.log('Starting screen fade out...');
      DoScreenFadeOut(0);
      await Delay(500);
      console.log('Screen fade out complete!');
      DisableIdleCamera(true)
      eventManager.emitServer('playerJoined'); // Stelle sicher, dass diese Methode existiert
      break;
    }
    await Delay(100); // Verzögerung, um die CPU-Last zu reduzieren
  }
})();