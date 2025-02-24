import { Player } from "../player/impl/Player"
import { House } from "./impl/House"
import { HouseBasement } from "./impl/HouseBasement"
import { HouseInterior } from "./impl/HouseInterior"

export type IHouseService = {
    load: () => void
    getHouseById: (id: number) => House | null
    getInteriorById: (id: number) => HouseInterior | null
    getBasementById: (id: number) => HouseBasement | null
    buyHouse: (player: Player, house: House) => boolean
    createHouse: (house: House) => Promise<House>
    createInterior: (interior: HouseInterior) => Promise<HouseInterior>
    createBasement: (basement: HouseBasement) => Promise<HouseBasement>
}