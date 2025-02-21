import { Position } from './Position'

export type Blip = {
    id: string;
    position: Position;
    name: string;
    sprite: number;
    color: number;
    scale: number;
}