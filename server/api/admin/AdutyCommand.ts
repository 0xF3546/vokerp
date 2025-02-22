import adminService, { getAdminService } from "@server/core/admin/impl/AdminService";
import commandManager from "@server/core/foundation/CommandManager";
import { Player } from "@server/core/player/impl/Player";

commandManager.add("aduty", (player: Player) => {
    if (player.rank.permLevel < 50) return;

    getAdminService().setPlayerAduty(player, !player.aduty);

    if (player.aduty) {
        player.notify("", "Du bist nun im Admin-Duty", "green");
    } else {
        player.notify("", "Du bist nun nicht mehr im Admin-Duty", "red");
    }
});