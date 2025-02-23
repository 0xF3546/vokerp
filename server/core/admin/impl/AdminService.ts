import { dataSource } from "@server/data/database/app-data-source";
import { IAdminService } from "../IAdminService";
import { Rank } from "./Rank";
import { Player } from "@server/core/player/impl/Player";
import { getPlayerService } from "@server/core/player/impl/PlayerService";
import { Gender } from "@shared/enum/Gender";
import { eventManager } from "@server/core/foundation/EventManager";
import { Ticket } from "./Ticket";

export class AdminService implements IAdminService {
    private rankRepository = dataSource.getRepository(Rank);
    private ticketRepository = dataSource.getRepository(Ticket);
    private ticketCache: Ticket[] = [];
    private rankCache = new Map<string, Rank>();

    load() {
        this.rankRepository.find().then(ranks => {
            ranks.forEach(rank => {
                this.rankCache.set(rank.name, rank);
            });
        });
    }

    getRankByName(name: string) {
        return this.rankCache.get(name);
    }

    setPlayerAduty = (player: Player, aduty: boolean) => {
        player.aduty = aduty;

        eventManager.emitClient(player, "Administrator::Aduty", aduty);
        if (aduty) {
            let charClothes = {};

            if (player.character.gender == Gender.MALE) {
                charClothes = {
                    11: [287, player.rank.clotheId],
                    8: [15, 0],
                    6: [78, player.rank.clotheId],
                    4: [114, player.rank.clotheId],
                    3: [167, player.rank.clotheId],
                    1: [135, player.rank.clotheId],
                    5: [0, 0],
                    10: [0, 0]
                }
            } else if (player.character.gender == Gender.FEMALE) {
                charClothes = {
                    11: [300, player.rank.clotheId],
                    8: [15, 0],
                    6: [82, player.rank.clotheId],
                    4: [121, player.rank.clotheId],
                    3: [151, player.rank.clotheId],
                    1: [135, player.rank.clotheId],
                    5: [0, 0],
                    10: [0, 0]
                }
            }

            player.character.setTmpClothes(JSON.stringify(charClothes));
        } else {
            player.character.setClothes(player.character.clothes, false);
        }
    }

    setPlayerRank = (player: Player, rank: Rank) => {
        player.rank = rank;
        getPlayerService().savePlayer(player);
    }

    createTicket = async (player: Player, message: string) => {
        const ticket = new Ticket();
        ticket.player = player;
        ticket.message = message;
        ticket.playerId = player.id;
        this.ticketCache.push(ticket);
        const dbTicket = await this.ticketRepository.save(ticket);
        return dbTicket;
    }

    closeTicket = async (player: Player, ticketId: number) => {
        const ticket = this.ticketCache.find(t => t.id === ticketId);
        if (ticket) {
            this.ticketCache.splice(this.ticketCache.indexOf(ticket), 1);
        } else return false;
        return true;
    }

    getTicketByPlayer = (player: Player) => {
        return this.ticketCache.find(t => t.player.id === player.id);
    }

    getTickets = () => {
        return this.ticketCache;
    }
}

export const adminServiceInitializer = {
    load: () => {
        adminService = new AdminService();
        adminService.load();
    }
}

export const getAdminService = () => {
    if (!adminService) {
        throw new Error("AdminService not initialized");
    }
    return adminService;
}

let adminService: IAdminService;
export default adminService;