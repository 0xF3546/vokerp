import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("animation_categories")
export class AnimationCategory {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;
}