import commandManager from "@server/core/foundation/CommandManager";
import { getFarmService } from "@server/core/gameplay/impl/FarmService";
import { Processor } from "@server/core/gameplay/impl/Processor";
import { Player } from "@server/core/player/impl/Player";

commandManager.add('createProcessor', async (player: Player, args) => {
    if (args.length !== 1) {
        player.notify("", `Fehler: /createProcessor [Name].`);
        return;
    }

    const processor = new Processor();
    processor.name = args[0];
    processor.position = player.character.position;

    getFarmService().createProcessor(processor).then((processor) => {
        player.notify("", `Verarbeiter ${processor.name} erstellt.`);
    });
});
    