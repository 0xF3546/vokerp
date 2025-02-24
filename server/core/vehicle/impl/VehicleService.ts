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
import { VehicleShop } from "./VehicleShop";
import { VehicleShopExitPoint } from "./VehicleShopExitPoint";
import { VehicleShopVehicle } from "./VehicleShopVehicle";

export class VehicleService implements IVehicleService {
    private vehicleRepository = dataSource.getRepository(Vehicle);
    private garageRepository = dataSource.getRepository(Garage);
    private vehicleClassRepository = dataSource.getRepository(VehicleClass);
    private garageExitPointRepository = dataSource.getRepository(GarageExitpoint);
    private vehicleShopRepository = dataSource.getRepository(VehicleShop);
    private vehicleShopVehicleRepository = dataSource.getRepository(VehicleShopVehicle);
    private vehicleShopExitPointRepository = dataSource.getRepository(VehicleShopExitPoint);
    private garageCache: Garage[] = [];
    private vehicleCache: Map<number, Vehicle> = new Map();
    private vehicleClassCache: VehicleClass[] = [];
    private vehicleShops: VehicleShop[] = [];

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

        this.vehicleShopRepository.find().then(shops => {
            this.vehicleShops = shops;
            console.log(`${shops.length} Fahrzeugshops wurden geladen.`);
        });

        this.vehicleShopVehicleRepository.find().then(vehicles => {
            vehicles.forEach(vehicle => {
                const shop = this.vehicleShops.find(s => s.id === vehicle.shopId);
                if (shop) {
                    shop.vehicles.push(vehicle);
                }
            });
        });

        this.vehicleShopExitPointRepository.find().then(exitPoints => {
            exitPoints.forEach(exitPoint => {
                const shop = this.vehicleShops.find(s => s.id === exitPoint.shopId);
                if (shop) {
                    shop.exitPoints.push(exitPoint);
                }
            });
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

    getVehicleShopById(id: number): VehicleShop | undefined {
        return this.vehicleShops.find(s => s.id === id);
    }

    getVehicleShops(): VehicleShop[] {
        return this.vehicleShops;
    }

    async createVehicleShop(shop: VehicleShop): Promise<VehicleShop> {
        await
        this.vehicleShopRepository.save(shop)
        .then(() => {
            this.vehicleShops.push(shop);
        });
        return shop;
    }

    async updateVehicleShop(shop: VehicleShop): Promise<VehicleShop> {
        return await this.vehicleShopRepository.save(shop);
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