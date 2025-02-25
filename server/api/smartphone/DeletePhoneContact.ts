import { eventManager } from "@server/core/foundation/EventManager";
import { Player } from "@server/core/player/impl/Player";
import { getPlayerService } from "@server/core/player/impl/PlayerService";

eventManager.on("Smartphone::DeleteContact", async (source: number, contactId: number) => {
    const player: Player = getPlayerService().getBySource(source);
    player.character.smartphone.deleteContact(contactId);
});