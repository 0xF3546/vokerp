import { dataSource } from "@server/data/database/app-data-source";
import { IHouseService } from "../IHouseService";
import { House } from "./House";
import { HouseInterior } from "./HouseInterior";
import { HouseBasement } from "./HouseBasement";
import { Player } from "@server/core/player/impl/Player";

export class HouseService implements IHouseService {
    private houseRepository = dataSource.getRepository(House);
    private interiorRepository = dataSource.getRepository(HouseInterior);
    private basementRepository = dataSource.getRepository(HouseBasement);

    private houses: House[] = [];
    private interiors: HouseInterior[] = [];
    private basements: HouseBasement[] = [];

    load = () => {
        this.houseRepository.find().then(houses => this.houses = houses);
        this.interiorRepository.find().then(interiors => this.interiors = interiors);
    }

    getHouseById = (id: number) => {
        return this.houses.find(h => h.id === id) || null
    }

    getInteriorById = (id: number) => {
        return this.interiors.find(i => i.id === id) || null;
    }

    getBasementById = (id: number) => {
        return this.basements.find(b => b.id === id) || null
    }

    buyHouse = (player: Player, house: House) => {
        if (!player.character.removeCash(house.price)) {
            return false;
        }

        house.owner = player.character;
        this.houseRepository.save(house);
        return true;
    }

    createHouse = async (house: House) => {
        house = await this.houseRepository.save(house);
        this.houses.push(house);
        return house;
    }

    createInterior = async (interior: HouseInterior) => {
        interior = await this.interiorRepository.save(interior);
        this.interiors.push(interior);
        return interior;
    }

    createBasement = async (basement: HouseBasement) => {
        basement = await this.basementRepository.save(basement);
        this.basements.push(basement);
        return basement;
    }
}

export const houseServerInitializer = {
    load: () => {
        houseService = new HouseService();
        houseService.load();
    }
}

export const getHouseService = () => {
    return houseService;
}

let houseService: IHouseService;
export default houseService;