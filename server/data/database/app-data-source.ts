import { Rank } from "@server/core/admin/impl/Rank";
import { Ticket } from "@server/core/admin/impl/Ticket";
import { Animation } from "@server/core/character/impl/Animation";
import { AnimationCategory } from "@server/core/character/impl/AnimationCategory";
import { Character } from "@server/core/character/impl/Character";
import { Faction } from "@server/core/faction/impl/Faction";
import { Clothe } from "@server/core/gameplay/impl/Clothe";
import { ClotheShop } from "@server/core/gameplay/impl/ClotheShop";
import { FarmingZone } from "@server/core/gameplay/impl/FarmingZone";
import { FarmingzonePosition } from "@server/core/gameplay/impl/FarmingzonePosition";
import { GasStation } from "@server/core/gameplay/impl/GasStation";
import { House } from "@server/core/gameplay/impl/House";
import { HouseBasement } from "@server/core/gameplay/impl/HouseBasement";
import { HouseInterior } from "@server/core/gameplay/impl/HouseInterior";
import { JumpPoint } from "@server/core/gameplay/impl/JumpPoint";
import { Processor } from "@server/core/gameplay/impl/Processor";
import { Shop } from "@server/core/shop/impl/Shop";
import { Inventory } from "@server/core/inventory/impl/Inventory";
import { InventoryItem } from "@server/core/inventory/impl/InventoryItem";
import { Item } from "@server/core/inventory/impl/Item";
import { Warehouse } from "@server/core/inventory/impl/Warehouse";
import { WarehouseStage } from "@server/core/inventory/impl/WarehouseStage";
import { Player } from "@server/core/player/impl/Player";
import { PlayerBan } from "@server/core/player/impl/PlayerBan";
import { PhoneChat } from "@server/core/smartphone/impl/PhoneChat";
import { PhoneChatMessage } from "@server/core/smartphone/impl/PhoneChatMessage";
import { PhoneContact } from "@server/core/smartphone/impl/PhoneContact";
import { Garage } from "@server/core/vehicle/impl/Garage";
import { GarageExitpoint } from "@server/core/vehicle/impl/GarageExitpoint";
import { Vehicle } from "@server/core/vehicle/impl/Vehicle";
import { VehicleClass } from "@server/core/vehicle/impl/VehicleClass";
import { VehicleShop } from "@server/core/vehicle/impl/VehicleShop";
import { VehicleShopExitPoint } from "@server/core/vehicle/impl/VehicleShopExitPoint";
import { VehicleShopVehicle } from "@server/core/vehicle/impl/VehicleShopVehicle";
import { DataSource } from "typeorm"
import { ShopItem } from "@server/core/shop/impl/ShopItem";
import { HouseTenant } from "@server/core/gameplay/impl/HouseTenant";
import { BankLog } from "@server/core/logging/BankLog";
import { CashLog } from "@server/core/logging/CashLog";

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
    entities: [Player, PlayerBan, Faction, Rank,
        Vehicle, VehicleClass, VehicleShop, VehicleShopVehicle, VehicleShopExitPoint,
        Character, Inventory, Item, InventoryItem, GasStation, House, Clothe, HouseBasement, HouseInterior, Garage, GarageExitpoint, Ticket, JumpPoint,
        Shop, ShopItem,
        ClotheShop,
        FarmingZone, FarmingzonePosition, Processor,
        Animation, AnimationCategory,
        PhoneChat, PhoneChatMessage, PhoneContact,
        Warehouse, WarehouseStage,
        HouseTenant,
        BankLog, CashLog]
})