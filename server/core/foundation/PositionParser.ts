import { Player } from "../player/impl/Player";
import { Position } from "../../../shared/types/Position";

export class PositionParser {
    static toPosition(coordinate: number[], heading = 0): Position {
        return {
            x: coordinate[0],
            y: coordinate[1],
            z: coordinate[2],
            heading: heading
        };
    }

    static applyPosition(entity: number | Player, position: Position) {
        if (entity instanceof Player) entity = entity.getPed();
        SetEntityCoords(entity, position.x || 0, position.y || 0, position.z || 0, false, false, false, false);
        SetEntityHeading(entity, position.heading || 0);
    }

    static getPosition(entity: number | Player) {
        let coords;
        if (entity instanceof Player) {
            entity = entity.getPed();
            coords = GetEntityCoords(entity);
        } else {
            coords = GetEntityCoords(entity);
        }
        return {
            x: coords[0],
            y: coords[1],
            z: coords[2],
            heading: GetEntityHeading(entity)
        }
    }
}