import { eventManager } from "./EventManager";

export const Delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const notify = (title: string | null, message: string, color: string = "green", delay = 5000) => {
    PlaySoundFrontend(-1, "DELETE", "HUD_DEATHMATCH_SOUNDSET", true);
    eventManager.emitWebView("notification", JSON.stringify({ title, message, color, delay }));
};