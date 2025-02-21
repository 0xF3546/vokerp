import "reflect-metadata";
import adminService from "./core/admin/impl/AdminService";
import factionService from "./core/faction/impl/FactionService";
import { dataSource } from "./data/database/app-data-source";
import houseService from "./core/gameplay/impl/HouseService";

on("onResourceStart", (resName: string) => {
  if (resName === GetCurrentResourceName()) {
    console.log("TypeScript boilerplate started!");
    dataSource
    .initialize()
    .then(() => {
      console.log("Database initialized!");
      console.log("Geladene Entities:", dataSource.entityMetadatas.map(e => e.name));
      init();
    })
    .catch((err) => {
      console.error("Error initializing database", err);
    });
  }
});


const init = () => {
  adminService.load();
  factionService.load();
  houseService.load();
}