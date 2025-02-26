import { dataSource } from "@server/data/database/app-data-source";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("bank_log")
export class BankLog {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    characterId: number;

    @Column()
    amount: number;

    @Column()
    isPlus: boolean;

    @Column()
    reason: string;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    timestamp: Date;

    static create = async (characterId: number, amount: number, isPlus: boolean, reason: string) => {
        const bankLog = new BankLog();
        bankLog.characterId = characterId;
        bankLog.amount = amount;
        bankLog.isPlus = isPlus;
        bankLog.reason = reason;
        return await dataSource.getRepository(BankLog).save(bankLog);
    }
}