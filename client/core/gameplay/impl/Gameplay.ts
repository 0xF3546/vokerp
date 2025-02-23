import { JumpPointDto } from "@shared/models/JumpPointDto";
import { IGameplay } from "../IGameplay";

export class Gameplay implements IGameplay {
    private jumpPoints: JumpPointDto[] = [];

    getJumpPoints(): JumpPointDto[] {
        return this.jumpPoints;
    }

    setJumpPoints(jumpPoints: JumpPointDto[]): void {
        this.jumpPoints = jumpPoints;
    }

    addJumpPoint(jumpPoint: JumpPointDto): void {
        this.jumpPoints.push(jumpPoint);
    }
}

export const gamePlay = new Gameplay();