import commandManager from "@server/core/foundation/CommandManager";
import { Warehouse } from "@server/core/inventory/impl/Warehouse";
import { getWarehouseService } from "@server/core/inventory/impl/WarehouseService";
import { Player } from "@server/core/player/impl/Player";

commandManager.add("addWarehouse", (player: Player, args) => {
    if (player.rank.permLevel < 90) return;
    if (args.length < 3) {
        player.notify("", "Syntax: /addWarehouse [Preis] [Name]");
        return;
    }

    const price = parseInt(args[1]);
    if (isNaN(price)) {
        player.notify("", "Syntax: /addWarehouse [Preis] [Name]");
        return;
    }

    const name = args.slice(2).join(" ");
    const warehouse = new Warehouse();
    warehouse.name = name;
    warehouse.price = price;
    warehouse.position = player.character.position;

    getWarehouseService().createWarehouse(warehouse).then(() => {
        player.notify("", `Lagerhalle ${warehouse.id} erstellt!`);
    });
});