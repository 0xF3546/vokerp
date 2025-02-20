import { Position } from "./Position";

export class PositionParser {
    static toPosition(coordinate: number[], heading = 0): Position {
        return {
            x: coordinate[0],
            y: coordinate[1],
            z: coordinate[2]
        };
    }

    static applyPosition(entity: number, position: Position) {
        SetEntityCoords(entity, position.x || 0, position.y || 0, position.z || 0, false, false, false, false);
    }
}