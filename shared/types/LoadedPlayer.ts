import { Gender } from "../enum/Gender";
import { Position } from "./Position";

export type LoadedPlayer = {
    firstname: string | null;
    lastname: string | null;
    gender: Gender;
    position: Position;
}