import { Player } from "../player/impl/Player";
import { eventManager } from "./EventManager";

export class ProgressBar {
    static show = (player: Player, duration: number, onComplete?: string, onCancel?: string) => {
        eventManager.emitWebView(player, "progressbar", "progressbar", { event: "show", duration, onComplete, onCancel });
    }

    static hide = (player: Player) : boolean => {
        eventManager.emitWebView(player, "progressbar", "progressbar", { event: "hide" });
        return false;
    }
}