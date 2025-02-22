import { Position } from './Position'

export class Blip {
    id: string;
    position: Position;
    name: string;
    sprite: number;
    color: number;
    scale: number;

    constructor(id: string, position: Position, name: string, sprite: number, color: number, scale: number) {
        this.id = id;
        this.position = position;
        this.name = name;
        this.sprite = sprite;
        this.color = color;
        this.scale = scale;
    }
}