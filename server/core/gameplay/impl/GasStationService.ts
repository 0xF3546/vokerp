import { dataSource } from "@server/data/database/app-data-source";
import { IGasStationService } from "../IGasStationService";
import { GasStation } from "./GasStation";

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
    }

    private update = async (gasStation) => {
        return await this.gasStationRepository.save(gasStation);
    }
}