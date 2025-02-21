import { Rank } from "@server/core/admin/impl/Rank";
import { Character } from "@server/core/character/impl/Character";
import { Faction } from "@server/core/faction/impl/Faction";
import { Clothe } from "@server/core/gameplay/impl/Clothe";
import { GasStation } from "@server/core/gameplay/impl/GasStation";
import { House } from "@server/core/gameplay/impl/House";
import { HouseBasement } from "@server/core/gameplay/impl/HouseBasement";
import { HouseInterior } from "@server/core/gameplay/impl/HouseInterior";
import { Inventory } from "@server/core/inventory/impl/Inventory";
import { InventoryItem } from "@server/core/inventory/impl/InventoryItem";
import { Item } from "@server/core/inventory/impl/Item";
import { Player } from "@server/core/player/impl/Player";
import { PlayerBan } from "@server/core/player/impl/PlayerBan";
import { Garage } from "@server/core/vehicle/impl/Garage";
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
    logging: false,
    synchronize: true,
    //entities: [__dirname + "../../core/**/impl/*.{js,ts}"],
    entities: [Player, PlayerBan, Faction, Rank, Vehicle, VehicleClass, Character, Inventory, Item, InventoryItem, GasStation, House, Clothe, HouseBasement, HouseInterior, Garage]
})