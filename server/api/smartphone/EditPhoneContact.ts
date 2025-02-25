import { eventManager } from "@server/core/foundation/EventManager";
import { Player } from "@server/core/player/impl/Player";
import { getPlayerService } from "@server/core/player/impl/PlayerService";
import { PhoneContact } from "@server/core/smartphone/impl/PhoneContact";
import { ContactDto } from "@shared/models/ContactDto";

eventManager.on("Smartphone::EditContact", async (source: number, contactData: string) => {
    const player: Player = getPlayerService().getBySource(source);
    const dto: ContactDto = JSON.parse(contactData);
    const contact = new PhoneContact();
    contact.name = dto.name;
    contact.number = dto.number;
    contact.pinned = dto.pinned;
    player.character.smartphone.editContact(contact);
});