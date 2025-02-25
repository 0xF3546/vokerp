import { PhoneChat } from "./impl/PhoneChat"
import { PhoneChatMessage } from "./impl/PhoneChatMessage"
import { PhoneContact } from "./impl/PhoneContact"

export type ISmartphoneService = {
    createChat: (chat: PhoneChat) => Promise<PhoneChat>
    getCharChats: (charId: number) => Promise<PhoneChat[]>
    getChat: (chatId: number) => Promise<PhoneChat>

    createContact: (contact: PhoneContact) => Promise<PhoneContact>
    getContacts: (charId: number) => Promise<PhoneContact[]>
    deleteContact: (contactId: number) => Promise<void>
    editContact: (contact: PhoneContact) => Promise<PhoneContact>
    getContact: (contactId: number) => Promise<PhoneContact>
    getContactByNumber: (charId: number, number: string) => Promise<PhoneContact | null>

    createMessage: (message: PhoneChatMessage) => Promise<PhoneChatMessage>
    getChatMessages: (chatId: number) => Promise<PhoneChatMessage[]>
    deleteMessage: (messageId: number) => Promise<void>
    editMessage: (message: PhoneChatMessage) => Promise<PhoneChatMessage>
    getMessage: (messageId: number) => Promise<PhoneChatMessage>
}