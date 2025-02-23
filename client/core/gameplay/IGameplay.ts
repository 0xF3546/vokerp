import { JumpPointDto } from "@shared/models/JumpPointDto";
export type IGameplay = {
    getJumpPoints: () => JumpPointDto[];
    setJumpPoints: (jumpPoints: JumpPointDto[]) => void;
    addJumpPoint: (jumpPoint: JumpPointDto) => void;
}