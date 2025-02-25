import { Gender } from "@shared/enum/Gender";

export class CharCreatorDto {
    data: string;
    useCreator: boolean = false;
    creatorData?: {
        gender: Gender;
        firstname: string;
        lastname: string;
        dateOfBirth: Date;
    }
}