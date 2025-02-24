import commandManager from "@server/core/foundation/CommandManager";
import { House } from "@server/core/gameplay/impl/House";
import { getHouseService } from "@server/core/gameplay/impl/HouseService";
import { Warehouse } from "@server/core/inventory/impl/Warehouse";
import { getWarehouseService } from "@server/core/inventory/impl/WarehouseService";
import { Player } from "@server/core/player/impl/Player";

commandManager.add("addHouse", (player: Player, args) => {
    if (player.rank.permLevel < 90) return;
    if (args.length < 3) {
        player.notify("", "Syntax: /addHouse [Interior] [Preis] [Keller(Ja/Nein())] [Name]");
        return;
    }
    const interiorId = parseInt(args[0]);
    if (isNaN(interiorId)) {
        player.notify("", "Syntax: /addHouse [Interior] [Preis] [Keller(Ja/Nein())] [Name]");
        return;
    }

    const price = parseInt(args[1]);
    if (isNaN(price)) {
        player.notify("", "Syntax: /addHouse [Interior] [Preis] [Keller(Ja/Nein())] [Name]");
        return;
    }

    const garage = args[2].toLowerCase() === "ja";

    const name = args.slice(3).join(" ");
    const house = new House();
    house.name = name;
    house.price = price;
    house.position = player.character.position;
    house.interiorId = interiorId;
    house.garage = garage;

    getHouseService().createHouse(house).then(() => {
        player.notify("", `Haus ${house.id} erstellt!`);
    });
    
});