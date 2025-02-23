import commandManager from "@server/core/foundation/CommandManager";
import { ClotheShop } from "@server/core/gameplay/impl/ClotheShop";
import { getGamePlay } from "@server/core/gameplay/impl/Gameplay";
import { Player } from "@server/core/player/impl/Player";

commandManager.add("addClothingStore", (player: Player, args) => {    
    if (player.rank.permLevel < 90) return;
    const clothingStore = new ClotheShop();
    clothingStore.position = player.character.position;
    clothingStore.name = args.join(" ");
    getGamePlay().createClotheShop(clothingStore).then((store) => {
        player.notify("", `Kleidungsladen mit der ID ${store.id} erstellt.`);
    });
});