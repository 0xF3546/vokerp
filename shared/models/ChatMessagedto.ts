export class ChatMessageDto {
    id!: number;
    chatId!: number;
    sender!: number;
    message!: string;
    timestamp!: Date;
    edited!: boolean;

    targetNumber?: string;
}