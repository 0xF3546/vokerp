import { Character } from "@server/core/character/impl/Character";
import { PhoneChat } from "./PhoneChat";
import { PhoneContact } from "./PhoneContact";
import { getSmartphoneService } from "./SmartphoneService";
import { PhoneChatMessage } from "./PhoneChatMessage";
import { getPlayerService } from "@server/core/player/impl/PlayerService";
import { eventManager } from "@server/core/foundation/EventManager";
import { ChatMessageDto } from "@shared/models/ChatMessagedto";

export class Smartphone {
    chats: PhoneChat[] = [];
    contacts: PhoneContact[] = [];
    private character: Character;
    constructor(character: Character) {
        this.initialize(character);
        this.character = character;
    }

    async initialize(character: Character) {
        this.chats = await getSmartphoneService().getCharChats(character.id);
        this.contacts = await getSmartphoneService().getContacts(character.id);
    }

    async createChat(chat: PhoneChat) {
        this.chats.push(chat);
        return await getSmartphoneService().createChat(chat);
    }

    getChatChats(charId: number) {
        return this.chats.filter(chat => chat.participant.includes(charId));
    }

    getChat(chatId: number) {
        return this.chats.find(chat => chat.id === chatId);
    }

    async createContact(contact: PhoneContact) {
        this.contacts.push(contact);
        return await getSmartphoneService().createContact(contact);
    }

    getContacts(charId: number) {
        return this.contacts.filter(contact => contact.charId === charId);
    }

    async deleteContact(contactId: number) {
        this.contacts = this.contacts.filter(contact => contact.id !== contactId);
        return await getSmartphoneService().deleteContact(contactId);
    }

    async editContact(contact: PhoneContact) {
        this.contacts = this.contacts.map(c => c.id === contact.id ? contact : c);
        return await getSmartphoneService().editContact(contact);
    }

    getContact(contactId: number) {
        return this.contacts.find(contact => contact.id === contactId);
    }

    async sendChatMessage(contactId: number, phoneMessage: PhoneChatMessage) {
        const contact = this.contacts.find(contact => contact.id === contactId);
        if (!contact) return;

        const chat = this.chats.find(chat => chat.participant.includes(contact.charId));
        if (!chat) return;

        const target = getPlayerService().getByCharId(contact.charId);
        const c = await getSmartphoneService().getContactByNumber(target.character.id, this.character.number);
        target.notify("Neue Nachricht", `Du hast eine neue Nachricht von ${c ? c.name : this.character.number} erhalten!`, "gray");
        const msg = await getSmartphoneService().createMessage(phoneMessage);

        chat.messages.push(msg);
        
        const msgDto = new ChatMessageDto();
        msgDto.message = msg.message;
        msgDto.chatId = chat.id;
        msgDto.contactId = contactId;
        msgDto.id = msg.id;
        msgDto.timestamp = msg.timestamp;
        msgDto.sender = msg.senderId;

        // Sync chats
        eventManager.emitClient(target, "Smartphone::NewMessage", JSON.stringify(msgDto));
        return msg;
    }
}