import commandManager from "@server/core/foundation/CommandManager";
import { FarmingZone } from "@server/core/gameplay/impl/FarmingZone";
import { getFarmService } from "@server/core/gameplay/impl/FarmService";
import { Player } from "@server/core/player/impl/Player";

commandManager.add('createFarmingZone', async (player: Player, name: string) => {
    if (player.rank.permLevel < 90) return;
    const farmingZone = new FarmingZone();
    farmingZone.name = name;
    farmingZone.position = player.character.position;
    await getFarmService().createFarmingzone(farmingZone).then(() => {
        player.notify(null, `FarmingZone ${name} erstellt mit ID ${farmingZone.id}!`);
    });
});