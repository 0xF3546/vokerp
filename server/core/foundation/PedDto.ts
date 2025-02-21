import { Position } from "@shared/types/Position";

export class PedDto {
    pedType: number = 4;
    model: string;
    position: Position;

    /**
     * Ped handle, used to identify the ped after creation
     */
    handle: number;

    constructor(model: string, position: Position) {
        this.model = model;
        this.position = position;
    }
}