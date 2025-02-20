import { Character } from "client/core/character/impl/Character";

export class Player {
    character!: Character;

    constructor(character) {
        this.character = character;
    }
}

export let player = null;