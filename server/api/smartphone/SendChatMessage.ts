import { eventManager } from "@server/core/foundation/EventManager";
import { Player } from "@server/core/player/impl/Player";
import { getPlayerService } from "@server/core/player/impl/PlayerService";
import { PhoneChatMessage } from "@server/core/smartphone/impl/PhoneChatMessage";
import { ChatMessageDto } from "@shared/models/ChatMessagedto";

eventManager.on("Smartphone::SendChatMessage", async (source: number, messageData: string) => {
    const player: Player = getPlayerService().getBySource(source);
    const dto: ChatMessageDto = JSON.parse(messageData);

    const phoneChatMessage = new PhoneChatMessage();
    phoneChatMessage.message = dto.message;
    phoneChatMessage.senderId = player.character.id;
    phoneChatMessage.chatId = dto.chatId;

    player.character.smartphone.sendChatMessage(dto.targetNumber, phoneChatMessage);
});