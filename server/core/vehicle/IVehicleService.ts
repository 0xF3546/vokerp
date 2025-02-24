import { Garage } from "./impl/Garage";
import { Vehicle } from "./impl/Vehicle";
import { VehicleClass } from "./impl/VehicleClass";
import { VehicleShop } from "./impl/VehicleShop";

export type IVehicleService = {
    load: () => void;
    parkVehicle: (vehicle: Vehicle) => void;
    unparkVehicle: (vehicle: Vehicle) => void;
    getVehicle: (vehicleId: number) => Promise<Vehicle>;
    getClassById: (id: number) => VehicleClass | null;
    createGarage(garage: Garage): void;

    getVehicleShopById(id: number): VehicleShop | undefined;
    getVehicleShops(): VehicleShop[];
    createVehicleShop(shop: VehicleShop): Promise<VehicleShop>;
    updateVehicleShop(shop: VehicleShop): Promise<VehicleShop>;
}