import { eventManager } from "client/core/foundation/EventManager";

let isCircleMenuVisible = false;
export function isCircleMenuOpen() {
    return isCircleMenuVisible;
}

export function createCircleMenu(menukey, menudata) {
    isCircleMenuVisible = true;
    eventManager.emitWebView("CircleMenu:Show", JSON.stringify(menukey, menudata));
}

export function closeCircleMenu() {
    if (isCircleMenuVisible) {
        isCircleMenuVisible = false;
        eventManager.emitWebView("CircleMenu:Close");
    }
}