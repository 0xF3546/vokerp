import { eventManager } from "@server/core/foundation/EventManager";
import { getPlayerService } from "@server/core/player/impl/PlayerService";

eventManager.onCallback("Bank::Withdraw", async (source, amount: number) => {
    const player = getPlayerService().getBySource(source);
    if (!player) {
        return;
    }

    if (await player.character.removeBank(amount, "Auszahlung ATM", true)) {
        player.character.addCash(amount, "Auszahlung ATM");
        return Promise.resolve({ success: true });
    }
    return Promise.resolve({ success: false });
});