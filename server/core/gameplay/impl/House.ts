import { Character } from "@server/core/character/impl/Character";
import { Position } from "@shared/types/Position";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import houseService from "./HouseService";
import { HouseTenant } from "./HouseTenant";

@Entity("housing")
export class House {
    tenants: HouseTenant[] = [];
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    ownerId: number | null = null;

    @Column("json")
    position!: Position;

    @Column()
    price!: number;

    @Column()
    interiorId!: number;

    @Column()
    name!: string;

    @Column({default: null, nullable: true})
    basementId!: number | null;

    @Column()
    garage!: boolean;

    @Column("json", {default: null})
    parkoutPositions: Position[] | null = null;

    @Column({default: 0})
    maxTenants!: number;

    isDoorOpen = false;

    get interior() {
        return houseService.getInteriorById(this.interiorId);
    }

    get basement() {
        return houseService.getBasementById(this.basementId);
    }

    set owner(character: Character | null) {
        this.ownerId = character?.id || null;
    }

    isTenant(charId: number) {
        return this.tenants.some(t => t.characterId === charId);
    }
}