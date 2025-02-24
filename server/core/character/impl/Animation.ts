import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("animations")
export class Animation {
    
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    nameText!: string;

    @Column()
    categoryId!: number;

    @Column()
    dictionary!: string;

    @Column()
    animationName!: string;

    @Column()
    flags!: number;

    @Column({default: true})
    active!: boolean;
}