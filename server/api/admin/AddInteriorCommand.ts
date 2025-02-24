import commandManager from "@server/core/foundation/CommandManager";
import { HouseInterior } from "@server/core/gameplay/impl/HouseInterior";
import { getHouseService } from "@server/core/gameplay/impl/HouseService";
import { Player } from "@server/core/player/impl/Player";

commandManager.add("addInterior", (player: Player, args) => {
    if (player.rank.permLevel < 90) return;
    if (args.length < 1) {
        player.notify("", "Syntax: /addInterior [Preis] [Name]");
        return;
    }

    const name = args.slice(1).join(" ");
    const price = parseInt(args[0]);
    const interior = new HouseInterior();
    interior.label = name;
    interior.position = player.character.position;
    interior.price = price;

    getHouseService().createInterior(interior).then(() => {
        player.notify("", `Interior ${interior.id} erstellt!`);
    });
});