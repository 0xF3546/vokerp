import { dataSource } from "./data/database/app-data-source";

on("onResourceStart", (resName: string) => {
  if (resName === GetCurrentResourceName()) {
    console.log("TypeScript boilerplate started!");
    dataSource
    .initialize()
    .then(() => {
      console.log("Database initialized!");
    })
    .catch((err) => {
      console.error("Error initializing database", err);
    });
  }
});
