import { dataSource } from "@server/data/database/app-data-source";
import { IVehicleService } from "../IVehicleService"
import { Vehicle } from "./Vehicle";
import { Garage } from "./Garage";
import { Position } from "@shared/types/Position";
import { VehicleClass } from "./VehicleClass";
import { getStreamer } from "@server/core/foundation/Streamer";
import { PedDto } from "@server/core/foundation/PedDto";

export class VehicleService implements IVehicleService {
    private vehicleRepository = dataSource.getRepository(Vehicle);
    private garageRepository = dataSource.getRepository(Garage);
    private vehicleClassRepository = dataSource.getRepository(VehicleClass);
    private garageCache: Garage[] = [];
    private vehicleCache: Map<number, Vehicle> = new Map();
    private vehicleClassCache: VehicleClass[] = [];

    load() {
        this.garageRepository.find().then(garages => {
            this.garageCache = garages;
        });

        this.vehicleClassRepository.find().then(vehicleClasses => {
            this.vehicleClassCache = vehicleClasses;
        });

        for (const garage of this.garageCache) {
            this.createBlip(garage);
        }
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
        getStreamer().createBlip({
            id: `garage_${garage.id}`,
            name: "Garage",
            position: garage.position,
            sprite: 473,
            color: 0,
            scale: 1
        });
    }

    getClassById(id: number) {
        return this.vehicleClassCache.find(c => c.id === id);
    }

    createGarage(garage: Garage): void {
        this.garageCache.push(garage);
        this.garageRepository.save(garage);
        this.createBlip(garage);
        getStreamer().createPed(new PedDto('s_m_m_autoshop_01', garage.position));
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