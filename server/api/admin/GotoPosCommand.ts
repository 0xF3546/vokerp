import commandManager from "@server/core/foundation/CommandManager";
import { Player } from "@server/core/player/impl/Player";
import { Position } from "@shared/types/Position";

commandManager.add(("gotopos"), (player: Player, args) => {
    if (player.rank.permLevel < 50) return;
    if (args.length < 3) {
        player.notify("Goto", `Nutze "/goto [X] [Y] [Z]" um dich zu Koordinaten zu teleportieren.`, "red", 5000);
        return;
    }
    const position: Position = {
        x: parseFloat(args[0]),
        y: parseFloat(args[1]),
        z: parseFloat(args[2])
    };
    player.character.position = position;
    player.notify("Goto", `Du wurdest zu ${position.x}/${position.y}/${position.z} teleportiert.`, "green", 5000);
});