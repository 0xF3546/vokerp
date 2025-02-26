import { eventManager } from "@server/core/foundation/EventManager";
import { getPlayerService } from "@server/core/player/impl/PlayerService";
import { getShopService } from "@server/core/shop/impl/ShopService";
import { ShopDto } from "@shared/models/ShopDto";

eventManager.onCallback(`Shop::GetItems`, async (source) => {
    const player = getPlayerService().getBySource(source);
    if (!player) return;
    const shopId = player.getVariable("shopId");
    if (!shopId) return;
    const shop = getShopService().getShopById(shopId);

    const dto = new ShopDto();
    dto.items = shop.items.map((item) => {
        return {
            id: item.id,
            name: item.item.displayName,
            price: item.price,
            image: item.item.imagePath,
        };
    });
    dto.name = shop.name;
    return dto;
})