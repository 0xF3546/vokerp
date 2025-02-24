import { dataSource } from "@server/data/database/app-data-source";
import { IFarmService } from "../IFarmService";
import { FarmingZone } from "./FarmingZone";
import { FarmingzonePosition } from "./FarmingzonePosition";
import { Position } from "@shared/types/Position";
import { getDistanceBetween } from "@server/core/foundation/Utils";
import { Processor } from "./Processor";
import { getStreamer } from "@server/core/foundation/Streamer";
import { PedDto } from "@server/core/foundation/PedDto";

export class FarmService implements IFarmService {
    private farmingRepository = dataSource.getRepository(FarmingZone);
    private farmingzonePositionRepository = dataSource.getRepository(FarmingzonePosition);
    private processorRepository = dataSource.getRepository(Processor);
    private farmingzones: FarmingZone[] = [];
    private processors: Processor[] = [];

    load() {
        this.farmingRepository.find().then(farmingzones => {
            this.farmingzones = farmingzones;
            console.log(`${farmingzones.length} Farmingzones wurden geladen.`);
        });

        this.farmingzonePositionRepository.find().then(farmingzonePositions => {
            farmingzonePositions.forEach(position => {
                const farmingzone = this.farmingzones.find(f => f.id === position.farmingzoneId);
                if (farmingzone) {
                    farmingzone.positions.push(position);
                }
            });
        });

        this.processorRepository.find().then(processors => {
            this.processors = processors;
            console.log(`${processors.length} Verarbeiter wurden geladen.`);
            this.processors.forEach(processor => {
                getStreamer().createPed(new PedDto(
                    processor.npc,
                    processor.position,
                ));
            });
        });
    }

    async createFarmingzone(farmingzone: FarmingZone): Promise<FarmingZone> {
        farmingzone = await this.farmingRepository.save(farmingzone);
        this.farmingzones.push(farmingzone);
        return farmingzone;
    }

    getFarmingzoneById(id: number): FarmingZone | undefined {
        return this.farmingzones.find(farmingzone => farmingzone.id === id);
    }

    getFarmingzones(): FarmingZone[] {
        return this.farmingzones;
    }

    async createFarmingzonePosition(farmingzonePosition: FarmingzonePosition): Promise<FarmingzonePosition> {
        farmingzonePosition = await this.farmingzonePositionRepository.save(farmingzonePosition);
        const farmingzone = this.farmingzones.find(f => f.id === farmingzonePosition.farmingzoneId);
        if (farmingzone) {
            farmingzone.positions.push(farmingzonePosition);
        }
        return farmingzonePosition;
    }

    getFarmingzonePositionById(id: number): FarmingzonePosition | undefined {
        return this.farmingzones.reduce<FarmingzonePosition | undefined>((acc, farmingzone) => {
            return acc || farmingzone.positions.find(position => position.id === id);
        }, undefined);
    }

    getFarmingzonePositions(): FarmingzonePosition[] {
        return this.farmingzones.reduce((acc, farmingzone) => {
            return acc.concat(farmingzone.positions);
        }, []);
    }

    getFarmingzonePositionsByFarmingzoneId(farmingzoneId: number): FarmingzonePosition[] {
        const farmingzone = this.farmingzones.find(f => f.id === farmingzoneId);
        return farmingzone ? farmingzone.positions : [];
    }

    async updateFarmingzonePosition(farmingzonePosition: FarmingzonePosition): Promise<FarmingzonePosition> {
        return await this.farmingzonePositionRepository.save(farmingzonePosition);
    }

    async deleteFarmingzonePosition(id: number): Promise<void> {
        this.farmingzones.forEach(farmingzone => {
            farmingzone.positions = farmingzone.positions.filter(position => position.id !== id);
        });
        await this.farmingzonePositionRepository.delete(id);
    }

    async updateFarmingzone(farmingzone: FarmingZone): Promise<FarmingZone> {
        return await this.farmingRepository.save(farmingzone);
    }

    async deleteFarmingzone(id: number): Promise<void> {
        this.farmingzones = this.farmingzones.filter(farmingzone => farmingzone.id !== id);
        await this.farmingRepository.delete(id);
    }

    getNearestFarmingzonePosition(position: Position): {farmingzone: FarmingZone, FarmingzonePosition: FarmingzonePosition, distance: number} | undefined {
        return this.farmingzones.flatMap(farmingzone => {
            return farmingzone.positions.map(pos => {
                return {
                    farmingzone,
                    FarmingzonePosition: pos,
                    distance: getDistanceBetween(pos.position, position)
                }
            });
        }).reduce((prev, current) => {
            return prev.distance < current.distance ? prev : current;
        });
    }      
    
    getProcessorById(id: number): Processor | undefined {
        return this.processors.find(processor => processor.id === id);
    }

    getProcessors(): Processor[] {
        return this.processors;
    }

    async createProcessor(processor: Processor): Promise<Processor> {
        processor = await this.processorRepository.save(processor);
        this.processors.push(processor);
        getStreamer().createPed(new PedDto(
            processor.npc,
            processor.position,
        ));
        return processor;
    }

    async updateProcessor(processor: Processor): Promise<Processor> {
        return await this.processorRepository.save(processor);
    }
}

let farmService: IFarmService;
export const farmServiceInitializer = {
    load: () => {
        farmService = new FarmService();
        farmService.load();
    }
}

export const getFarmService = () => {
    if (!farmService) {
        throw new Error("FarmService is not initialized.");
    }
    return farmService;
}