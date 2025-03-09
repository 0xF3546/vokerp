import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("animations")
export class Animation {
    
    @PrimaryGeneratedColumn()
    id!: number;

    @Column('longtext')
    nameText!: string;

    @Column()
    categoryId!: number;

    @Column('longtext')
    dictionary!: string;

    @Column('longtext')
    animationName!: string;

    @Column()
    flags!: number;

    @Column({default: true})
    active!: boolean;
}