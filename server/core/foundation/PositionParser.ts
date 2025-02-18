import { Position } from "./Position";

export class PositionParser {
    static toPosition(coordinate: number[]): Position {
        return {
            x: coordinate[0],
            y: coordinate[1],
            z: coordinate[2],
            heading: coordinate[3]
        };
    }

    static applyPosition(entity: number, position: Position) {
        SetEntityCoords(entity, position.x, position.y, position.z, false, false, false, false);
    }
}