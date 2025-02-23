import { CharacterData } from "@shared/types/CharacterData";
import { CharacterClothes } from "@shared/types/CharacterClothes";
import { CharacterProps } from "@shared/types/CharacterProps";

export class Character {
    get position() {
        return {
            x: GetEntityCoords(PlayerPedId(), true)[0],
            y: GetEntityCoords(PlayerPedId(), true)[1],
            z: GetEntityCoords(PlayerPedId(), true)[2],
            heading: GetEntityHeading(PlayerPedId())
        }
    }
}

export const character = new Character();