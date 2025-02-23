import commandManager from "@server/core/foundation/CommandManager";
import { getGamePlay } from "@server/core/gameplay/impl/Gameplay";
import { Shop } from "@server/core/gameplay/impl/Shop";
import { Player } from "@server/core/player/impl/Player";

commandManager.add("addShop", (player: Player, args) => {    
    if (player.rank.permLevel < 90) return;
    const shop = new Shop();
    shop.position = player.character.position;
    shop.name = args.join(" ");
    getGamePlay().createShop(shop).then((shop) => {
        player.notify("", `Shop mit der ID ${shop.id} erstellt.`);
    });
});