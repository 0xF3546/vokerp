import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Inventory } from "../../inventory/impl/Inventory";
import { Position } from "../../../../shared/types/Position";
import { Player } from "@server/core/player/impl/Player";
import { CharacterData } from "@shared/types/CharacterData";
import { CharacterClothes } from "@shared/types/CharacterClothes";
import { CharacterProps } from "@shared/types/CharacterProps";
import { eventManager } from "@server/core/foundation/EventManager";
import { LoadedPlayer } from "@shared/types/LoadedPlayer";
import { Gender } from "@shared/enum/Gender";
import { getPlayerService } from "@server/core/player/impl/PlayerService";
import { PositionParser } from "@server/core/foundation/PositionParser";
import factionService from "@server/core/faction/impl/FactionService";
import { DEFAULT_CHARACTER_CLOTHES } from "@shared/constants/DEFAULT_CHARACTER_CLOTHES";
import { DEFAULT_CHARACTER_PROPS } from "@shared/constants/DEFAULT_CHARACTER_PROPS";
import { DEFAULT_CHARACTER_DATA } from "@shared/constants/DEFAULT_CHARACTER_DATA";
import { Smartphone } from "@server/core/smartphone/impl/Smartphone";
import { CharCreatorDto } from "@shared/models/CharCreatorDto";

@Entity("character")
export class Character {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToOne(() => Inventory, { cascade: true, eager: true })
  @JoinColumn()
  inventory!: Inventory;

  @Column({ type: "enum", enum: Gender, default: Gender.MALE })
  gender!: Gender;

  @Column({ default: null })
  firstname!: string;

  @Column({ default: null })
  lastname!: string;

  @Column({ default: null })
  birthdate!: Date;

  @Column({ default: 0 })
  level!: number;

  @Column({ default: 0 })
  minutes!: number;

  @Column({ default: 0 })
  hours!: number;

  @Column("json", { nullable: true })
  lastPosition?: Position = {
    x: -1035.0,
    y: -2737.0,
    z: 20.0,
    heading: 0.0,
  };


  @Column({ default: 0 })
  armour!: number;

  @Column({ default: 100 })
  health!: number;

  @Column({ default: 5000 })
  cash!: number;

  @Column({ default: 2500 })
  bank!: number;

  @Column({ nullable: true, default: null })
  factionId!: number | null;

  @Column({ default: 0 })
  factionRank!: number;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  factionJoinDate!: Date;

  @Column("json")
  data?: CharacterData = DEFAULT_CHARACTER_DATA;

  @Column("json")
  clothes?: CharacterClothes = DEFAULT_CHARACTER_CLOTHES;

  @Column("json")
  props?: CharacterProps = DEFAULT_CHARACTER_PROPS

  @Column("json", { nullable: true })
  tattoos?: string[] = [];

  @Column("json", { default: "[]" })
  animations: number[] = [];

  @Column({ default: null, nullable: true })
  number!: string | null;

  player?: Player;

  smartphone?: Smartphone;

  private tempData;

  private lastTeleport = Date.now();

  get position() {
    return PositionParser.getPosition(this.player);
  }

  set position(pos: Position) {
    this.lastTeleport = Date.now();
    PositionParser.applyPosition(this.player, pos);
  }

  get faction() {
    return factionService.getFactionById(this.factionId);
  }

  get name() {
    return `${this.firstname} ${this.lastname}`;
  }

  load = () => {
    this.loadMPModel(this.data);

    SetPedArmour(GetPlayerPed(this.player.source.toString()), this.player.character.armour);
    // SetEntityHealth(GetPlayerPed(player.source.toString()), player.character.health);

    this.smartphone = new Smartphone(this);

    if (this.firstname === null) {
      this.setCreator(true);
    }
  }

  setCreator = (state: boolean, creatorDto: CharCreatorDto = null, save = true) => {
    if (state) {
      this.tempData = this.data;
      this.player.setDimension(this.player.id + 1000);
      this.position = {
        x: -1374.6988525390625,
        y: 55.93846130371094,
        z: 60.3677978515625,
        heading: 93.54330444335938,
      }
      eventManager.emitWebView(this.player, "showComponent", "charcreator");
    } else {
      eventManager.emitWebView(this.player, "hideComponent", "charcreator");
      if (creatorDto.useCreator) {
        this.position = {
          x: -1043.063720703125,
          y: -2746.760498046875,
          z: 21.3436279296875,
          heading: 328.81890869140625,
        }
        this.firstname = creatorDto.creatorData.firstname;
        this.lastname = creatorDto.creatorData.lastname;
        this.birthdate = creatorDto.creatorData.dateOfBirth;
      } else {
        this.position = {
          x: 299,
          y: -584,
          z: 43,
        }
      }
      eventManager.emitWebView(this.player, "showComponent", "hud");
      this.player.setDimension(0);
      if (!save) {
        this.data = this.tempData;
        this.loadMPModel(this.data);
        this.setClothes(this.clothes, false);
      }
    }
  }

  removeCash = (amount: number): boolean => {
    if (this.cash < amount) return false;
    this.cash -= amount;
    getPlayerService().savePlayer(this.player);
    return true;
  }

  addCash = (amount: number): void => {
    this.cash += amount;
    getPlayerService().savePlayer(this.player);
  }

  removeBank = (amount: number): boolean => {
    if (this.bank < amount) return false;
    this.bank -= amount;
    getPlayerService().savePlayer(this.player);
    return true;
  }

  addBank = (amount: number): void => {
    this.bank += amount;
    getPlayerService().savePlayer(this.player);
  }

  loadMPModel = (charData: CharacterData) => {
    for (let key in charData) {
      console.log(`Setting ${key} to ${charData[key]}`);
      this.setData(key, charData[key], false);
    }
  }

  setData = (id, val, save = true) => {
    const ped = GetPlayerPed(this.player.source.toString());

    switch (id) {
      case 'Gender':
        if (this.data[id] != val) {
          if (save) this.data[id] = val;

          // Geschlecht ändern (setzt es auf den Server)
          emitNet("setGender", this.player.source, val);
        }
        break;

      case 'shapeFirst':
      case 'shapeSecond':
      case 'shapeMix':
      case 'skinFirst':
      case 'skinSecond':
      case 'skinMix':
        if (save) this.data[id] = (id.includes('Mix')) ? parseFloat(val) : parseInt(val);

        // Setze Kopf- und Hautmischung
        SetPedHeadBlendData(
          ped,
          parseInt(this.getValue('shapeFirst', 0)),
          parseInt(this.getValue('shapeSecond', 0)),
          0,
          parseInt(this.getValue('skinFirst', 0)),
          parseInt(this.getValue('skinSecond', 0)),
          0,
          parseFloat(this.getValue('shapeMix', 0.0)),
          parseFloat(this.getValue('skinMix', 0.0)),
          0,
          false
        );
        break;

      case 'noseWidth':
        if (save) this.data[id] = parseFloat(val);

        // Setze Nasenbreite
        SetPedFaceFeature(ped, 0, parseFloat(val));
        break;

      case 'eyesColor':
        if (save) this.data[id] = parseInt(val);

        // Setze Augenfarbe
        SetPedEyeColor(ped, parseInt(val));
        break;

      case 'hair':
        if (save) this.data[id] = parseInt(val);

        // Setze Frisur
        this.setHairStyle(val);
        break;

      case 'hairColor':
      case 'hairColor2':
        if (save) this.data[id] = parseInt(val);

        if (id === 'hairColor') {
          SetPedHairColor(ped, parseInt(val), parseInt(this.getValue("hairColor2", 0)));
        } else {
          SetPedHairColor(ped, parseInt(this.getValue("hairColor", 0)), parseInt(val));
        }
        break;

      case 'beardStyle':
        if (save) this.data[id] = parseInt(val);

        // Setze Bartstil
        if (parseInt(val) > 28) {
          SetPedHeadOverlay(ped, 1, -1, 0); // Kein Overlay für Bart
          //SetPedComponentVariation(ped, 10, customBeards[parseInt(val)], 0, 2); // Bart als Kleidung
        } else {
          SetPedComponentVariation(ped, 10, 0, 0, 2); // Kein Bart als Kleidung
          SetPedHeadOverlay(ped, 1, parseInt(val), parseFloat(this.getValue(`beardOpacity`, 0.0))); // Bart Overlay
          SetPedHeadOverlayColor(ped, 1, 1, parseInt(this.getValue(`beardColor`, 0)), parseInt(this.getValue(`beardColor`, 0))); // Bartfarbe
        }
        break;

      case 'beardOpacity':
        if (save) this.data[id] = parseFloat(val);

        // Setze die Opazität des Bartes
        SetPedHeadOverlay(ped, 1, parseInt(this.getValue('beardStyle', 0)), parseFloat(val));
        break;

      case 'lipstickColor':
        if (save) this.data[id] = parseInt(val);

        // Setze Lippenstiftfarbe und Opazität
        SetPedHeadOverlay(ped, 8, parseInt(this.getValue("lipstickOpacity", 0)), 1.0);
        SetPedHeadOverlayColor(ped, 8, 2, parseInt(val), parseInt(val));
        break;

      case 'lipstickOpacity':
        if (save) this.data[id] = parseFloat(val);

        // Setze die Opazität des Lippenstifts
        SetPedHeadOverlay(ped, 8, parseInt(this.getValue('lipstickColor', 0)), parseFloat(val));
        break;

      case 'blushStyle':
        if (save) this.data[id] = parseInt(val);

        // Setze Blush-Stil und Opazität
        SetPedHeadOverlay(ped, 5, parseInt(val), parseFloat(this.getValue('blushOpacity', 0.0)));
        SetPedHeadOverlayColor(ped, 5, 2, parseInt(this.getValue('blushColor', 0)), parseInt(this.getValue('blushColor', 0)));
        break;

      case 'blushOpacity':
        if (save) this.data[id] = parseFloat(val);

        // Setze die Opazität des Blush
        SetPedHeadOverlay(ped, 5, parseInt(this.getValue('blushStyle', 0)), parseFloat(val));
        break;

      case 'ageing':
        if (save) this.data[id] = parseInt(val);

        // Setze Altersanzeige
        SetPedHeadOverlay(ped, 3, parseInt(this.getValue("ageing", 0)), 1.0);
        break;

      default:
        // Alle anderen Felder, die nicht explizit behandelt werden, können hier gesetzt werden
        if (save) this.data[id] = val;
        break;
    }
  };

  private getValue = (id, cb) => {
    if (this.data[id] == undefined) return cb;

    return this.data[id];
  }

  setHairStyle = (id) => {
    const ped = GetPlayerPed(this.player.source.toString());

    SetPedComponentVariation(ped, 2, parseInt(id), 0, 2);

    //ClearPedDecorations(ped);

    this.loadTattoos();

    let hairOverlay = undefined;
    const gender = this.getValue("Gender", 0);

    /*if (gender == 0) {
      // Männliche Haare
      hairOverlay = maleHairOverlays[parseInt(id)];
    } else if (gender == 1) {
      // Weibliche Haare
      hairOverlay = femaleHairOverlays[parseInt(id)];
    }*/

    if (hairOverlay !== undefined) {
      AddPedDecorationFromHashes(ped, GetHashKey(hairOverlay.collection), GetHashKey(hairOverlay.overlay));
    }
  };

  setClothes = async (clothes: CharacterClothes, save = true) => {
    if (save) {
      this.clothes = clothes;
    }

    const ped = this.player.getPed();

    for (const [id, [drawableId, textureId]] of Object.entries(clothes)) {
      const componentId = parseInt(id);
      const drawable = parseInt(drawableId.toString());
      const texture = parseInt(textureId.toString());

      if (componentId === 10) {
        // if (isCustomBeard(parseInt(charData["beardStyle"]))) continue;
        continue;
      } else if (componentId === 1) {
        if (drawable === 135) {
          SetPedComponentVariation(ped, componentId, drawable, texture, 2);
          continue;
        }
        if (this.player.getVariable("maskState")) {
          SetPedComponentVariation(ped, 1, 0, 0, 2);
          continue;
        }
      }

      SetPedComponentVariation(ped, componentId, drawable, texture, 2);
    }

    //eventManager.emitClient(this.player, "Character::setClothes", JSON.stringify(this.clothes));

    if (save) {
      getPlayerService().savePlayer(this.player);
    }
  }

  setClothe = async (componentId, drawable, texture, save = true) => {
    if (save) this.clothes[componentId] = [drawable, texture];

    SetPedComponentVariation(this.player.getPed(), componentId, drawable, texture, 0);
    eventManager.emitClient(this.player, "Character::setClothe", componentId, drawable, texture);

    if (save) getPlayerService().savePlayer(this.player);
  }

  saveClothes = async () => {
    getPlayerService().savePlayer(this.player);
    return true;
  }

  setTmpClothes = (clothes) => {
    clothes = JSON.parse(clothes);

    this.setClothes(clothes, false);
  }

  setProp = async (componentId, drawable, texture, save = true) => {
    if (save) this.props[componentId] = [drawable, texture];

    SetPedPropIndex(this.player.getPed(), componentId, drawable, texture, true);
    // eventManager.emitClient(this.player, "Character::setProp", componentId, drawable, texture);

    if (save) getPlayerService().savePlayer(this.player);
}

  setProps = async (props: CharacterProps, save = true) => {
    if (save) this.props = props;

    for (let id in props) {
      const propIndex = parseInt(props[id][0].toString());
      const propTexture = parseInt(props[id][1].toString());
      SetPedPropIndex(this.player.getPed(), parseInt(id), propIndex, propTexture, true);

      if (propIndex == -1) {
        ClearPedProp(this.player.getPed(), parseInt(id));
      }
    }

    if (save) getPlayerService().savePlayer(this.player);

  }

  setNaked = () => {
    this.setClothe(1, 0, 0, false);
    this.setClothe(2, 0, 0, false);
    this.setClothe(3, 15, 0, false);
    this.setClothe(4, 21, 0, false);
    this.setClothe(5, 0, 0, false);
    this.setClothe(6, 0, 0, false);
    this.setClothe(7, 0, 0, false);
    this.setClothe(8, 15, 0, false);
    this.setClothe(9, 0, 0, false);
    this.setClothe(10, 0, 0, false);
    this.setClothe(11, 15, 0, false);
    this.setProp(0, 8, 0)
}

  loadTattoos = () => {

  }
}