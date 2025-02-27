import { eventManager } from "@server/core/foundation/EventManager";
import { getPlayerService } from "@server/core/player/impl/PlayerService";
import { BankDto } from "@shared/models/BankDto";

eventManager.onCallback("Bank::Load", async (source) => {
    const player = getPlayerService().getBySource(source);
    if (!player) {
        return;
    }

    const dto: BankDto = {
        bank: player.character.bank,
        cash: player.character.cash,
        useFaction: false,
        user: player.character.name,
        transactions: player.character.transactions.map(t => ({
            amount: t.amount,
            date: t.timestamp.toISOString(),
            id: t.id,
            reason: t.reason,
            type: t.isPlus ? "deposit" : "withdraw"
        }))
    }

    return JSON.stringify(dto);
});