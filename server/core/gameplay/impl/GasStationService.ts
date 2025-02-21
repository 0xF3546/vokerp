import { dataSource } from "@server/data/database/app-data-source";
import { IGasStationService } from "../IGasStationService";
import { GasStation } from "./GasStation";
import { getStreamer } from "@server/core/foundation/Streamer";

export class GasStationService implements IGasStationService {
    private gasStationRepository = dataSource.getRepository(GasStation);
    private gasStationCache: GasStation[] = [];

    getGasStations = () => {
        return this.gasStationCache;
    }

    setFuel: (gasStation: GasStation, fuel: number) => void;

    load = () => {
        this.gasStationRepository.find().then(gasStations => {
            gasStations.forEach(gasStation => {
                this.gasStationCache.push(gasStation);
            });
        });

        for (const gasStation of this.gasStationCache) {
            this.createBlip(gasStation);
        }
    }

    create(gasStation: GasStation): void {
        this.gasStationCache.push(gasStation);
        this.gasStationRepository.save(gasStation);
        this.createBlip(gasStation);
    }
    
    private createBlip(gasStation: GasStation) {
        getStreamer().createBlip({
            id: `gasStation_${gasStation.id}`,
            name: "Tankstelle",
            position: gasStation.position,
            sprite: 361,
            color: 0,
            scale: 1
        });
    }

    private update = async (gasStation) => {
        return await this.gasStationRepository.save(gasStation);
    }
}

export const gasStationServiceInitializer = {
    load: () => {
        gasStationService = new GasStationService();
        gasStationService.load();
    }
}

export const getGasStationService = () => {
    if (!gasStationService) {
        throw new Error("GasStationService is not initialized.");
    }
    return gasStationService;
}

let gasStationService: IGasStationService;
export default gasStationService;