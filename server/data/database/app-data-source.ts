import { Rank } from "@server/core/admin/impl/Rank";
import { Character } from "@server/core/character/impl/Character";
import { Faction } from "@server/core/faction/impl/Faction";
import { GasStation } from "@server/core/gameplay/impl/GasStation";
import { Inventory } from "@server/core/inventory/impl/Inventory";
import { InventoryItem } from "@server/core/inventory/impl/InventoryItem";
import { Item } from "@server/core/inventory/impl/Item";
import { Player } from "@server/core/player/impl/Player";
import { Vehicle } from "@server/core/vehicle/impl/Vehicle";
import { VehicleClass } from "@server/core/vehicle/impl/VehicleClass";
import { DataSource } from "typeorm"

export const dataSource = new DataSource({
    type: "mariadb",
    host: "185.117.3.65",
    port: 3306,
    username: "erik",
    password: "485zbtmfrt435t",
    database: "vokerp",
    logging: true,
    synchronize: true,
    //entities: [__dirname + "../../core/**/impl/*.{js,ts}"],
    entities: [Player, Faction, Rank, Vehicle, VehicleClass, Character, Inventory, Item, InventoryItem, GasStation]
})