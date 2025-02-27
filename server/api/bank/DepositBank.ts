import { eventManager } from "@server/core/foundation/EventManager";
import { getPlayerService } from "@server/core/player/impl/PlayerService";

eventManager.onCallback("Bank::Deposit", async (source, amount: number) => {
    const player = getPlayerService().getBySource(source);
    if (!player) {
        return;
    }

    if (player.character.removeCash(amount, "Einzahlung ATM")) {
        player.character.addBank(amount, "Einzahlung ATM", true);
        return Promise.resolve({ success: true });
    }
    return Promise.resolve({ success: false });
});