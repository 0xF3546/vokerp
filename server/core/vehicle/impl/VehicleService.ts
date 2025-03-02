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
import { Delay, getDistanceBetween } from "@server/core/foundation/Utils";
import { Character } from "@server/core/character/impl/Character";

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

    async load() {
        await this.garageRepository.find().then(garages => {
            this.garageCache = garages;
            console.log(`${garages.length} Garagen wurden geladen.`);
        })
        .then(() => {
            this.garageCache.forEach(garage => {
                this.createBlip(garage);
                getStreamer().createPed(new PedDto(garage.npc, garage.position));    
            });
        });

        await this.garageExitPointRepository.find().then(exitPoints => {
            exitPoints.forEach(exitPoint => {
                const garage = this.garageCache.find(g => g.id === exitPoint.garageId);
                if (garage) {
                    garage.exitPoints.push(exitPoint);
                }
            });
        });

        await this.vehicleClassRepository.find().then(vehicleClasses => {
            this.vehicleClassCache = vehicleClasses;
            console.log(`${vehicleClasses.length} Fahrzeugklassen wurden geladen.`);
        });

        await this.vehicleShopRepository.find().then(shops => {
            this.vehicleShops = shops;
            console.log(`${shops.length} Fahrzeugshops wurden geladen.`);
            this.vehicleShops.forEach(shop => {
                getStreamer().createPed(new PedDto(shop.ped, shop.position));
                getStreamer().createBlip(new Blip(
                    `vehicleShop_${shop.id}`,
                    shop.position,
                    shop.getTypeName(),
                    shop.blip,
                    0,
                    1
                ));
            });
        });

        await this.vehicleShopVehicleRepository.find().then(vehicles => {
            vehicles.forEach(vehicle => {
                const shop = this.vehicleShops.find(s => s.id === vehicle.shopId);
                if (shop) {
                    shop.vehicles.push(vehicle);
                }
            });
        });

        await this.vehicleShopExitPointRepository.find().then(exitPoints => {
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
        DeleteEntity(vehicle.entity);
        vehicle.entity = null;
    }

    unparkVehicle(vehicle: Vehicle): boolean {
        const garage = this.getGarageById(vehicle.garageId);
        console.log(garage);
        if (!garage) return false;
        garage?.exitPoints.forEach(async exitPoint => {
            console.log(this.getNearestVehicles(exitPoint.position, 5));
            console.log(this.getNearestVehicles(exitPoint.position, 5).length);
            if (this.getNearestVehicles(exitPoint.position, 5).length === 0) {
                await this.createVehicle(vehicle, exitPoint.position);
                this.setParkedState(vehicle, false);
                return true;
            }
        });
        return false;
    }

    private getNearestVehicles(position: Position, distance: number): Vehicle[] {
        return Array.from(this.vehicleCache.values()).filter(v => getDistanceBetween(position, v.position) <= distance);
    }

    getGarageById(id: number): Garage | undefined {
        return this.garageCache.find(g => g.id === id);
    }

    createVehicle = async (vehicle: Vehicle, position: Position) => {
        const veh = CreateVehicle(GetHashKey(vehicle.vehicleClass.model), position.x, position.y, position.z, position.heading, true, true);
        while (!DoesEntityExist(veh)) {
            await Delay(100);
        }
        SetVehicleNumberPlateText(veh, vehicle.licensePlate || '');
        Entity(veh).state['id'] = vehicle.id;
        vehicle.entity = veh;
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

    createGarageExitPoint(garageExitPoint: GarageExitpoint): void {
        if (garageExitPoint.order === undefined) {
            garageExitPoint.order = this.garageCache.find(g => g.id === garageExitPoint.garageId).exitPoints.length;
        }
        this.garageExitPointRepository.save(garageExitPoint)
        .then(() => {
            const garage = this.garageCache.find(g => g.id === garageExitPoint.garageId);
            if (garage) {
                garage.exitPoints.push(garageExitPoint);
            }
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

    getNearestGarage(position: Position): {Garage: Garage, distance: number} | undefined {
        return this.garageCache.map(g => {
            return {
                Garage: g,
                distance: getDistanceBetween(position, g.position)
            }
        }).reduce((prev, current) => {
            return prev.distance < current.distance ? prev : current;
        });
    }

    getGarageVehicles(character: Character, garageId: number): Vehicle[] {
        throw new Error("Method not implemented.");
    }

    async findGarageVehicles(charId: number, garageId: number): Promise<Vehicle[]> | undefined {
        const result = await this.vehicleRepository.find({
            where: {
                charId: charId,
                garageId: garageId
            }
        });
        result.forEach(v => v.vehicleClassId = this.getClassById(v.vehicleClassId).id);
        return result;
    }

    getNearestCharacterVehicles(character: Character): Vehicle[] {
        return this.getNearestVehicles(character.position, 5).filter(v => v.charId === character.id);
    }

    getNearestVehicleShop(position: Position): { VehicleShop: VehicleShop; distance: number; } | undefined {
        return this.vehicleShops.map(s => {
            return {
                VehicleShop: s,
                distance: getDistanceBetween(position, s.position)
            }
        }).reduce((prev, current) => {
            return prev.distance < current.distance ? prev : current;
        });
    }

    getVehicleShopVehicleById(id: number): VehicleShopVehicle | undefined {
        return this.vehicleShops.map(s => s.vehicles.find(v => v.id === id)).find(v => v !== undefined);
    }

    async purchaseVehicle(character: Character, vehicleShopVehicle: VehicleShopVehicle): Promise<Vehicle> {
        if (!character.removeCash(vehicleShopVehicle.price)) {
            character.player.notify(``, "Du hast nicht genügend Geld.");
            return null;
        }
        const vehicleShop = this.getVehicleShopById(vehicleShopVehicle.shopId);
        let vehicle = new Vehicle();
        const vehicleClass = getVehicleService().getClassById(vehicleShopVehicle.vehicleClass);
        vehicle.charId = character.id;
        vehicle.vehicleClassId = vehicleShopVehicle.vehicleClass;
        vehicle.garageId = vehicleShop.garageId;
        vehicle.parked = false;
        vehicle.fuel = vehicleClass.maxFuel;
        vehicleShop.exitPoints.forEach(async (exitPoint) => {
            if (this.getNearestVehicles(exitPoint.position, 5).length === 0) {
                vehicle.lastPosition = exitPoint.position;
                vehicle = await this.vehicleRepository.save(vehicle);
                this.createVehicle(vehicle, exitPoint.position);
                return vehicle;
            }
        });
        character.player.notify(``, `Es wurde kein freier Ausparkpunkt gefunden.`);
        return null;
    }

    async createVehicleShopVehicle(vehicleShopVehicle: VehicleShopVehicle): Promise<VehicleShopVehicle> {
        this.vehicleShops.forEach(async vehicleShop => {
            if (vehicleShop.id === vehicleShopVehicle.shopId) {
                const veh = await this.vehicleShopVehicleRepository.save(vehicleShopVehicle);
                vehicleShop.vehicles.push(veh);
                return veh;
            }
        })
        return undefined;
    }

    createVehicleExitPoint(vehicleShopExitPoint: VehicleShopExitPoint): Promise<VehicleShopExitPoint | undefined> {
        this.vehicleShops.forEach(async vehicleShop => {
            if (vehicleShop.id === vehicleShopExitPoint.shopId) {
                const exitPoint = await this.vehicleShopExitPointRepository.save(vehicleShopExitPoint);
                vehicleShop.exitPoints.push(exitPoint);
                return exitPoint;
            }
        })
        return undefined;
    }

    findVehicle(vehicleId: number): Promise<Vehicle | null> {
        return this.vehicleRepository.findOne({
            where: {
                id: vehicleId
            }
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