import { Character } from "@server/core/character/impl/Character";
import { Position } from "@server/core/foundation/Position";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import houseService from "./HouseService";

@Entity("housing")
export class House {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    private ownerId: number | null = null;

    @Column("json")
    position!: Position;

    @Column()
    price!: number;

    @Column()
    interiorId!: number;

    @Column()
    basementId!: number;

    get interior() {
        return houseService.getInteriorById(this.interiorId);
    }

    get basement() {
        return houseService.getBasementById(this.basementId);
    }

    set owner(character: Character | null) {
        this.ownerId = character?.id || null;
    }
}