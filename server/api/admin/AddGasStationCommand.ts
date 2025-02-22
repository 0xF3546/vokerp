import commandManager from "@server/core/foundation/CommandManager";
import { notify } from "@server/core/foundation/Utils";
import { GasStation } from "@server/core/gameplay/impl/GasStation";
import gasStationService, { getGasStationService } from "@server/core/gameplay/impl/GasStationService";
import { Player } from "@server/core/player/impl/Player";

commandManager.add("addGasStation", (player: Player, args) => {
    if (player.rank.permLevel < 100) return;

    
    const gasStation = new GasStation();
    gasStation.position = player.character.position;

    getGasStationService().create(gasStation);
    player.notify("", "Tankstelle erstellt", "green");
});