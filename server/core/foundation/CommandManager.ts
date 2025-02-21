import { getPlayerService } from "../player/impl/PlayerService";

class CommandManager {
    add = (command: string, f: (player: any, ...args: any[]) => void, restricted = false) => {
        RegisterCommand(command, (source: number, ...args: any[]) => {
            const player = getPlayerService().getBySource(source);
            if (!player) return console.warn(`Player not found for source ${source}`);
            f(player, ...args);
        }, restricted);
    }
}

const commandManager = new CommandManager();
export default commandManager;
