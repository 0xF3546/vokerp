import { eventManager } from "@server/core/foundation/EventManager";
import { getPlayerService } from "@server/core/player/impl/PlayerService";

eventManager.onCallback("Bank::Transfer", async (source, data) => {
    const {amount, target} = JSON.parse(data);
    const player = getPlayerService().getBySource(source);
    if (!player) {
        return;
    }

    const targetPlayer = getPlayerService().getPlayers().find(p => p.character.name === target);
    if (!targetPlayer) {
        return Promise.resolve({success: false});
    }

    if (!player.character.removeBank(amount, "Überweisung " + targetPlayer.character.name, true)) {
        return Promise.resolve({success: false});
    }

    targetPlayer.character.addBank(amount, "Überweisung von " + player.character.name, true);
    targetPlayer.notify("Bank", "Du hast eine Überweisung von " + player.character.name + " erhalten.");
    player.notify("Bank", "Du hast " + targetPlayer.character.name + " " + amount + "$ überwiesen.");
    return Promise.resolve({success: true});
});