import { dataSource } from "@server/data/database/app-data-source";
import { ISmartphoneService } from "../ISmartphoneService";
import { PhoneChat } from "./PhoneChat";
import { PhoneContact } from "./PhoneContact";
import { PhoneChatMessage } from "./PhoneChatMessage";

export class SmartphoneService implements ISmartphoneService {
    private chatRepository = dataSource.getRepository(PhoneChat);
    private contactRepository = dataSource.getRepository(PhoneContact);
    private messageRepository = dataSource.getRepository(PhoneChatMessage);

    async createChat(chat: PhoneChat): Promise<PhoneChat> {
        return this.chatRepository.save(chat);
    }

    async getCharChats(charId: number): Promise<PhoneChat[]> {
        return this.chatRepository.find({ where: { participant: charId } });
    }

    async getChat(chatId: number): Promise<PhoneChat> {
        return this.chatRepository.findOne({
            where: { id: chatId },
            relations: ["messages"]
        });
    };

    async createContact(contact: PhoneContact): Promise<PhoneContact> {
        return this.contactRepository.save(contact);
    }

    async getContacts(charId: number): Promise<PhoneContact[]> {
        return this.contactRepository.find({ where: { charId } });
    }

    async deleteContact(contactId: number): Promise<void> {
        await this.contactRepository.delete(contactId);
    }

    async editContact(contact: PhoneContact): Promise<PhoneContact> {
        return this.contactRepository.save(contact);
    }

    async getContact(contactId: number): Promise<PhoneContact> {
        return this.contactRepository.findOneBy({ id: contactId });
    }

    async getContactByNumber(charId: number, number: string): Promise<PhoneContact | null> {
        return this.contactRepository.findOne({ where: { charId, number } });
    }

    async createMessage(message: PhoneChatMessage): Promise<PhoneChatMessage> {
        return this.messageRepository.save(message);
    }

    async getChatMessages(chatId: number): Promise<PhoneChatMessage[]> {
        return this.messageRepository.find({ where: { chatId } });
    }

    async deleteMessage(messageId: number): Promise<void> {
        await this.messageRepository.delete(messageId);
    }

    async editMessage(message: PhoneChatMessage): Promise<PhoneChatMessage> {
        message.editedTimestamp = new Date();
        message.edited = true;
        return this.messageRepository.save(message);
    }

    async getMessage(messageId: number): Promise<PhoneChatMessage> {
        return this.messageRepository.findOneBy({ id: messageId });
    }
}

let smartphoneService: ISmartphoneService;

export const getSmartphoneService = () => {
    if (!smartphoneService) {
        smartphoneService = new SmartphoneService();
    }

    return smartphoneService;
}