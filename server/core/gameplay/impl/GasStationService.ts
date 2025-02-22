import { dataSource } from "@server/data/database/app-data-source";
import { IGasStationService } from "../IGasStationService";
import { GasStation } from "./GasStation";
import { getStreamer } from "@server/core/foundation/Streamer";
import { Blip } from "@shared/types/Blip";

export class GasStationService implements IGasStationService {
    private gasStationRepository = dataSource.getRepository(GasStation);
    private gasStationCache: GasStation[] = [];

    getGasStations = () => {
        return this.gasStationCache;
    }

    setFuel: (gasStation: GasStation, fuel: number) => void;

    load = () => {
        this.gasStationRepository.find().then(gasStations => {
            console.log(`${gasStations.length} Tankstellen wurden geladen.`);
            this.gasStationCache = gasStations;
        })
        .then(() => {
            this.gasStationCache.forEach(gasStation => {
                this.createBlip(gasStation);
            });
        });
    }

    create(gasStation: GasStation): void {
        this.gasStationCache.push(gasStation);
        this.gasStationRepository.save(gasStation);
        this.createBlip(gasStation);
    }
    
    private createBlip(gasStation: GasStation) {
        getStreamer().createBlip(new Blip(
            `gasStation_${gasStation.id}`,
            gasStation.position,
            "Tankstelle",
            361,
            0,
            1
        ));
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