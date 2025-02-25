import { eventManager } from "@server/core/foundation/EventManager";
import { Player } from "@server/core/player/impl/Player";
import { getPlayerService } from "@server/core/player/impl/PlayerService";
import { ContactDto } from "@shared/models/ContactDto";

eventManager.onCallback("Smartphone::LoadContacts", async (source: number, contactId: number) => {
    const player: Player = getPlayerService().getBySource(source);
    const dtos: ContactDto[] = player.character.smartphone.getContacts().map((contact) => {
        return {
            id: contact.id,
            name: contact.name,
            number: contact.number,
            pinned: contact.pinned
        };
    });
    return JSON.stringify(dtos);
});