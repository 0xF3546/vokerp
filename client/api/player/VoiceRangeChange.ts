import { VOICE_RANGES } from "@shared/constants/VOICE_RANGES";
import { Delay, Keys } from "client/core/foundation/Utils";
import { player } from "client/core/Player/impl/Player";

(async () => {
    try {
        while (true) {
            await Delay(0);
            if (IsControlJustPressed(0, Keys["Y"])) {
                const voiceRange = await player.setVoiceRange(player.voiceRange + 1, true);
                const range = VOICE_RANGES[voiceRange];

                const startTime = GetGameTimer();
                const endTime = startTime + 4000;

                if (typeof DrawMarker !== "function") {
                    console.error("DrawMarker ist keine Funktion. Stelle sicher, dass die native Funktion verfügbar ist.");
                    return;
                }

                const interval = setInterval(() => {
                    if (GetGameTimer() >= endTime) {
                        clearInterval(interval); // Stoppe den Intervall nach 4 Sekunden
                        return;
                    }

                    const playerPed = PlayerPedId();
                    if (!playerPed) {
                        console.error("Spieler-Ped ist nicht gültig.");
                        return;
                    }

                    const playerCoords = GetEntityCoords(playerPed, false);
                    console.log("DrawMarker wird aufgerufen mit:", {
                        playerCoords,
                        range,
                        color: [255, 0, 0, 100],
                    });

                    DrawMarker(
                        1,
                        playerCoords[0], playerCoords[1], playerCoords[2] - 1,
                        0, 0, 0,
                        0, 0, 0,
                        range, range, 0.1,
                        255, 0, 0, 100,
                        false,
                        true,
                        2,
                        false,
                        "", "",
                        false
                    );
                }, 0);
            }
        }
    } catch (error) {
        console.error("Fehler im Skript:", error);
    }
})();