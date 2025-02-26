import { GarageType } from "@shared/enum/Garage";
import { GarageVehicleDto } from "@shared/models/GarageVehicleDto";

export class GarageDto {
    name: string;
    type: GarageType;
}