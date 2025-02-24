import "reflect-metadata";
import { adminServiceInitializer } from "./core/admin/impl/AdminService";
import { factionServiceInitializer } from "./core/faction/impl/FactionService";
import { dataSource } from "./data/database/app-data-source";
import { houseServerInitializer } from "./core/gameplay/impl/HouseService";
import { vehicleServiceInitializer } from "./core/vehicle/impl/VehicleService";
import { gasStationServiceInitializer } from "./core/gameplay/impl/GasStationService";
import { playerServiceInitializer } from "./core/player/impl/PlayerService";
import { gamePlayInitializer } from "./core/gameplay/impl/Gameplay";
import { farmServiceInitializer } from "./core/gameplay/impl/FarmService";

on("onResourceStart", (resName: string) => {
  if (resName === GetCurrentResourceName()) {
    console.log("TypeScript boilerplate started!");
    dataSource
    .initialize()
    .then(() => {
      console.log("Database initialized!");
      init(dataSource);
    })
    .catch((err) => {
      console.error("Error initializing database", err);
    });
  }
});


const init = (dataSource) => {
  playerServiceInitializer.load();
  adminServiceInitializer.load();
  vehicleServiceInitializer.load();
  factionServiceInitializer.load();
  houseServerInitializer.load();
  gasStationServiceInitializer.load();
  gamePlayInitializer.load();
  farmServiceInitializer.load();
}