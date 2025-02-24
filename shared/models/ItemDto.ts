export class ItemDto {
    id!: number;
    name!: string;
    weight!: number;
    maxStack!: number;
    imagePath!: string;
    displayName!: string;

    constructor(id: number, name: string, weight: number, maxStack: number, imagePath: string, displayName: string) {
        this.id = id;
        this.name = name;
        this.weight = weight;
        this.maxStack = maxStack;
        this.imagePath = imagePath;
        this.displayName = displayName;
    }
}