import { dataSource } from "@server/data/database/app-data-source";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("money_log")
export class CashLog {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    characterId: number;

    @Column()
    amount: number;

    @Column()
    isPlus: boolean;

    @Column('longtext')
    reason: string;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    timestamp: Date;

    static create = async (characterId: number, amount: number, isPlus: boolean, reason: string) => {
        const cashLog = new CashLog();
        cashLog.characterId = characterId;
        cashLog.amount = amount;
        cashLog.isPlus = isPlus;
        cashLog.reason = reason;
        return await dataSource.getRepository(CashLog).save(cashLog);
    }
}