import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Inventory } from "../../inventory/impl/Inventory";
import { Gender } from "../enums/Gender";
import { Position } from "../../foundation/Position";
import { Faction } from "../../faction/impl/Faction";
import { Player } from "@server/core/player/impl/Player";
import { CharacterData } from "@server/core/types/CharacterData";
import { CharacterClothes } from "@server/core/types/CharacterClothes";
import { CharacterProps } from "@server/core/types/CharacterProps";

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

  @ManyToOne(() => Faction, { nullable: true, eager: true })
  @JoinColumn()
  faction!: Faction | null;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  factionJoinDate!: Date;

  @Column("json", { nullable: true })
  data?: CharacterData = {
    Gender: 0,
    shapeFirst: 0,
    shapeSecond: 22,
    shapeMix: 0.7,
    skinMix: 0.4,
    skinFirst: 2,
    noseWidth: 0,
    browHeight: 1,
    lips: 0,
    neckWidth: 0,
    eyesColor: 3,
    hair: 39,
    hairColor: 0,
    hairColor2: 29,
    beardStyle: 29,
    beardOpacity: 0
  };

  @Column("json", { nullable: true })
  clothes?: CharacterClothes = {
    "0": ["0", "0"],
    "1": ["0", "0"],
    "3": ["0", "0"],
    "4": ["0", "0"],
    "5": ["112", "0"],
    "6": ["7", "0"],
    "7": ["0", "0"],
    "8": ["15", "0"],
    "9": ["0", "0"],
    "10": ["0", "0"],
    "11": ["442", "1"]
  };

  @Column("json", { nullable: true })
  props?: CharacterProps = {
    "0": ["142", 0],
    "1": ["18", 0],
    "2": ["41", 0],
    "6": ["30", 0],
    "7": ["9", 0]
  };

  @Column("json", { nullable: true })
  tattoos?: string[] = [];

  player?: Player;

  load = () => {
    this.loadMPModel(this.data);
  }


  loadMPModel = (charData: CharacterData) => {
    let model = 1885233650;
    if (this.gender === Gender.FEMALE) model = -1667301416;
    SetPlayerModel(this.player.source.toString(), model.toString())
    
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
          emitNet("setGender", this.player, val);
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

  loadTattoos = () => {
    
  }


}