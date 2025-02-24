import { Position } from "@shared/types/Position";
import { FarmingZone } from "./impl/FarmingZone";
import { FarmingzonePosition } from "./impl/FarmingzonePosition";

export type IFarmService = {
    load: () => void;
    getFarmingzoneById: (id: number) => FarmingZone | undefined;
    getFarmingzones: () => FarmingZone[];
    createFarmingzone: (farmingzone: FarmingZone) => Promise<FarmingZone>;
    createFarmingzonePosition: (farmingzonePosition: FarmingzonePosition) => Promise<FarmingzonePosition>;
    getFarmingzonePositionById: (id: number) => FarmingzonePosition | undefined;
    getFarmingzonePositions: () => FarmingzonePosition[];
    getFarmingzonePositionsByFarmingzoneId: (farmingzoneId: number) => FarmingzonePosition[];
    updateFarmingzonePosition: (farmingzonePosition: FarmingzonePosition) => Promise<FarmingzonePosition>;
    deleteFarmingzonePosition: (id: number) => Promise<void>;
    updateFarmingzone: (farmingzone: FarmingZone) => Promise<FarmingZone>;
    deleteFarmingzone: (id: number) => Promise<void>;
    getNearestFarmingzonePosition: (position: Position) => {FarmingzonePosition: FarmingzonePosition, distance: number} | undefined;
};