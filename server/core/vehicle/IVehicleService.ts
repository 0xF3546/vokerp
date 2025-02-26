import { Position } from "@shared/types/Position";
import { Garage } from "./impl/Garage";
import { Vehicle } from "./impl/Vehicle";
import { VehicleClass } from "./impl/VehicleClass";
import { VehicleShop } from "./impl/VehicleShop";
import { Character } from "../character/impl/Character";

export type IVehicleService = {
    load: () => void;
    parkVehicle: (vehicle: Vehicle) => void;
    unparkVehicle: (vehicle: Vehicle) => boolean;
    getGarageVehicles(character: Character, garageId: number): Vehicle[];
    findGarageVehicles(charId: number, garageId: number): Promise<Vehicle[]> | undefined;
    getNearestCharacterVehicles(character: Character): Vehicle[];
    getVehicle: (vehicleId: number) => Promise<Vehicle>;
    getClassById: (id: number) => VehicleClass | null;
    createGarage(garage: Garage): void;
    getGarageById(id: number): Garage | undefined;
    /// es soll die distanz und garage zurückgeben
    getNearestGarage(position: Position): {Garage: Garage, distance: number} | undefined;

    getVehicleShopById(id: number): VehicleShop | undefined;
    getVehicleShops(): VehicleShop[];
    createVehicleShop(shop: VehicleShop): Promise<VehicleShop>;
    updateVehicleShop(shop: VehicleShop): Promise<VehicleShop>;
}