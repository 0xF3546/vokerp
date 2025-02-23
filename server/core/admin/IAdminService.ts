import { Player } from "../player/impl/Player";
import { Rank } from "./impl/Rank";
import { Ticket } from "./impl/Ticket";

export type IAdminService = {
    getRankByName: (name: string) => Rank;
    load: () => void;
    setPlayerAduty: (player: Player, aduty: boolean) => void;
    setPlayerRank: (player: Player, rank: Rank) => void;

    createTicket: (player: Player, message: string) => Promise<Ticket>;
    closeTicket: (player: Player, ticketId: number) => Promise<boolean>;
    getTicketByPlayer: (player: Player) => Ticket;
    getTickets: () => Ticket[];
}