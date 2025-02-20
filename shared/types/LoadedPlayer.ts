import { Gender } from "../enum/Gender";

export type LoadedPlayer = {
    firstname: string | null;
    lastname: string | null;
    gender: Gender;
}