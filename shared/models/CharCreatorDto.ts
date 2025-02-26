import { Gender } from "@shared/enum/Gender";
import { CharacterData } from "@shared/types/CharacterData";

export class CharCreatorDto {
    data: CharacterData;
    useCreator: boolean = false;
    creatorData?: {
        gender: Gender;
        firstname: string;
        lastname: string;
        dateOfBirth: Date;
    }
}