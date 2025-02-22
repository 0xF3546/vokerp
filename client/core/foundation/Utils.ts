import { eventManager } from "./EventManager";

export const Delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const notify = (title: string | null, message: string, color: string = "green", delay = 5000) => {
    eventManager.emitWebView("notification", JSON.stringify({ title, message, color, delay }));
};