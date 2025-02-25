import { eventManager } from "@server/core/foundation/EventManager";
import { Player } from "@server/core/player/impl/Player";
import { getPlayerService } from "@server/core/player/impl/PlayerService";
import { ChatMessageDto } from "@shared/models/ChatMessagedto";

eventManager.onCallback("Smartphone::LoadMessages", async (source: number, chatId: number) => {
    const player: Player = getPlayerService().getBySource(source);
    const chat = player.character.smartphone.getChat(chatId);
    const messages: ChatMessageDto[] = chat.messages.map((message) => {
        return {
            id: message.id,
            message: message.message,
            senderId: message.senderId,
            chatId: message.chatId,
            edited: message.edited,
            sender: message.senderId,
            timestamp: message.timestamp
        };
    });

    return JSON.stringify(messages);
});