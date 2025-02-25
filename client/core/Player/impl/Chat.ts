import { eventManager } from "client/core/foundation/EventManager";

let isChatVisible = false;

export function isChatOpen() {
    return isChatVisible;
}

export function showChat() {
    isChatVisible = true;
    eventManager.emitWebView('showComponent', 'chat');
}

export function closeChat() {
    if (isChatVisible) {
        isChatVisible = false;
        eventManager.emitWebView("hideComponent", "chat");
    }
}