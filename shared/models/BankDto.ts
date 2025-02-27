import { TransactionDto } from "./TransactionDto";

export class BankDto {
    user!: string;
    cash!: number;
    bank!: number;
    transactions!: TransactionDto[];
    
    useFaction: boolean = false;
}