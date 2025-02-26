import { eventManager } from "@server/core/foundation/EventManager";
import { InventoryItem } from "@server/core/inventory/impl/InventoryItem";
import { getInventoryService } from "@server/core/inventory/impl/InventoryService";
import { getPlayerService } from "@server/core/player/impl/PlayerService";
import { getShopService } from "@server/core/shop/impl/ShopService";
import { CheckoutDto } from "@shared/models/CheckoutDto";

eventManager.on(`Shop::Checkout`, async (source, data) => {
    const player = getPlayerService().getBySource(source);
    if (!player) return;

    const items = JSON.parse(data) as CheckoutDto[];

    const shopItem = items.map(item => getShopService().getItemById(item.itemId));

    const total = shopItem.reduce((acc, item) => acc + item.price, 0);
    const itemWeight = shopItem.reduce((acc, item) => acc + item.item.weight, 0);
    if (!player.character.inventory.hasWidth(itemWeight)) {
        player.notify("Shop", "Du hast nicht genug Platz im Inventar.", "red");
        return;
    }
    if (!player.character.removeCash(total)) {
        player.notify("Shop", "Du hast nicht genug Geld (" + total + "$).", "red");
        return;
    }

    player.character.inventory.addItems(items.map(item => ({ item: item.itemId, amount: item.amount })));

    player.notify("Shop", "Du hast erfolgreich eingekauft.", "green");

    eventManager.emit(player, "Shop::Close");
})