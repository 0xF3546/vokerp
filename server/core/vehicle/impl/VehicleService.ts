import { dataSource } from "@server/data/database/app-data-source";
import { IVehicleService } from "../IVehicleService"
import { Vehicle } from "./Vehicle";
import { Garage } from "./Garage";
import { Position } from "@shared/types/Position";
import { VehicleClass } from "./VehicleClass";
import { getStreamer } from "@server/core/foundation/Streamer";
import { PedDto } from "@server/core/foundation/PedDto";
import { Blip } from "@shared/types/Blip";
import { GarageExitpoint } from "./GarageExitpoint";

export class VehicleService implements IVehicleService {
    private vehicleRepository = dataSource.getRepository(Vehicle);
    private garageRepository = dataSource.getRepository(Garage);
    private vehicleClassRepository = dataSource.getRepository(VehicleClass);
    private garageExitPointRepository = dataSource.getRepository(GarageExitpoint);
    private garageCache: Garage[] = [];
    private vehicleCache: Map<number, Vehicle> = new Map();
    private vehicleClassCache: VehicleClass[] = [];

    load() {
        this.garageRepository.find().then(garages => {
            this.garageCache = garages;
            console.log(`${garages.length} Garagen wurden geladen.`);
        })
        .then(() => {
            this.garageCache.forEach(garage => {
                this.createBlip(garage);
                getStreamer().createPed(new PedDto(garage.npc, garage.position));    
            });
        });

        this.garageExitPointRepository.find().then(exitPoints => {
            exitPoints.forEach(exitPoint => {
                const garage = this.garageCache.find(g => g.id === exitPoint.garageId);
                if (garage) {
                    garage.exitPoints.push(exitPoint);
                }
            });
        });

        this.vehicleClassRepository.find().then(vehicleClasses => {
            this.vehicleClassCache = vehicleClasses;
            console.log(`${vehicleClasses.length} Fahrzeugklassen wurden geladen.`);
        });
    }

    parkVehicle(vehicle: Vehicle): void {
        this.setParkedState(vehicle, true);
    }

    unparkVehicle(vehicle: Vehicle): void {
        this.setParkedState(vehicle, false);
    }

    createVehicle = (vehicle: Vehicle, position: Position) => {
        const veh = CreateVehicle(GetHashKey(vehicle.vehicleClass.model), position.x, position.y, position.z, position.heading, true, true);
        SetVehicleNumberPlateText(veh, vehicle.licensePlate || '');
        Entity(veh).state.set['id'] = vehicle.id;
        return veh;
    }

    private setParkedState(vehicle: Vehicle, state: boolean): void {
        vehicle.parked = state;
        this.vehicleRepository.save(vehicle);
    }

    async getVehicle(vehicleId: number): Promise<Vehicle> {
        if (this.vehicleCache.has(vehicleId)) {
            return this.vehicleCache.get(vehicleId);
        } else {
            const vehicle = await this.vehicleRepository.findOne({
                where: {
                    id: vehicleId
                }
            });
            this.vehicleCache.set(vehicleId, vehicle);
            return vehicle;
        }

    }

    private createBlip(garage: Garage) {
        getStreamer().createBlip(new Blip(
            `garage_${garage.id}`,
            garage.position,
            "Garage",
            473,
            0,
            1
        ));
    }

    getClassById(id: number) {
        return this.vehicleClassCache.find(c => c.id === id);
    }

    createGarage(garage: Garage): void {
        getStreamer().createPed(new PedDto(garage.npc || 's_m_m_autoshop_01', garage.position));
        this.garageRepository.save(garage)
        .then(() => {
            this.createBlip(garage);
            this.garageCache.push(garage);
        });
    }    
}

export const vehicleServiceInitializer = {
    load: () => {
        vehicleService = new VehicleService();
        vehicleService.load();
    }
}

export const getVehicleService = () => {
    if (!vehicleService) {
        throw new Error("VehicleService is not initialized.");
    }
    return vehicleService;
}

let vehicleService: IVehicleService;
export default vehicleService;