import commandManager from "@server/core/foundation/CommandManager";
import { FarmingzonePosition } from "@server/core/gameplay/impl/FarmingzonePosition";
import { getFarmService } from "@server/core/gameplay/impl/FarmService";
import { Player } from "@server/core/player/impl/Player";

commandManager.add('addFarmingSpot', async (player: Player, args) => {
    if (player.rank.permLevel < 90) return;
    if (args.length < 1) {
        player.notify(null, `Fehler: /addFarmingSpot [ID]`);
        return;
    }
    const farmingSpot = new FarmingzonePosition();
    farmingSpot.farmingzoneId = parseInt(args[0]);
    farmingSpot.position = player.character.position;
    await getFarmService().createFarmingzonePosition(farmingSpot).then(() => {
        player.notify(null, `FarmingSpot erstellt mit ID ${farmingSpot.id}!`);
    });
});