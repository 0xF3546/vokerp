import { eventManager } from "@server/core/foundation/EventManager";
import { Player } from "@server/core/player/impl/Player";
import { getPlayerService } from "@server/core/player/impl/PlayerService";
import { ChatDto } from "@shared/models/ChatDto";

eventManager.onCallback("Smartphone::LoadChats", async (source, cb) => {
    const player: Player = getPlayerService().getBySource(source);
    const chats: ChatDto[]  = player.character.smartphone.chats.map((chat) => {
        const lastMesasge = chat.messages[chat.messages.length - 1];
        return {
            id: chat.id,
            // Needs to be changed to contactName or Number of title is null
            displayName: chat.title ||'',
            lastMessage: lastMesasge ? lastMesasge.message : '',
            timestamp: lastMesasge ? lastMesasge.timestamp : 0,
            lastMessageDate: lastMesasge ? new Date(lastMesasge.timestamp) : new Date(0),
        };
    });
    return JSON.stringify(chats);
});