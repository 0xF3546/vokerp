import { Position } from "@shared/types/Position";

export class JumpPointDto {
    id: number;
    enterPoint: Position;
    exitPoint: Position;
    factionId: number | null;
    
    constructor(enterPoint: Position, exitPoint: Position, factionId: number | null) {
        this.enterPoint = enterPoint;
        this.exitPoint = exitPoint;
        this.factionId = factionId;
    }
}