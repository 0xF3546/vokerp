import { Garage } from "./impl/Garage";
import { Vehicle } from "./impl/Vehicle";
import { VehicleClass } from "./impl/VehicleClass";

export type IVehicleService = {
    load: () => void;
    parkVehicle: (vehicle: Vehicle) => void;
    unparkVehicle: (vehicle: Vehicle) => void;
    getVehicle: (vehicleId: number) => Promise<Vehicle>;
    getClassById: (id: number) => VehicleClass | null;
    createGarage(garage: Garage): void;
}