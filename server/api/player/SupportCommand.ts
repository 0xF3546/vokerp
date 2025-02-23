import { getAdminService } from "@server/core/admin/impl/AdminService";
import { Ticket } from "@server/core/admin/impl/Ticket";
import commandManager from "@server/core/foundation/CommandManager";
import { notifications } from "@server/core/foundation/Utils";
import { Player } from "@server/core/player/impl/Player";

commandManager.add(("support"), (player: Player, args) => {
    if (args.length === 0) {
        player.notify("Support", `Nutze "/support [Nachricht]" um ein Ticket zu erstellen.`, "red", 5000);
        return;
    }
    if (args[0] === "close") {
        const ticket: Ticket = getAdminService().getTicketByPlayer(player);
        if (!ticket) {
            player.notify("Support", `Du hast kein offenes Ticket.`, "red", 5000);
            return;
        }
        getAdminService().closeTicket(player, ticket.id);
        player.notify("Support", `Du hast dein Ticket geschlossen.`, "green", 5000);
        return;
    }
    getAdminService().createTicket(player, args.join(" "));
    player.notify("Support", `Du hast ein Ticket erstellt. Nutze "/support close" um das Ticket zu schließen.`, "green", 15000);
    notifications.sendTeamNotification("Support", `[Support] ${player.character.name} hat ein Ticket erstellt.`, "green");
});