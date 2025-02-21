import { Blip } from "@shared/types/Blip";
import { IStreamer } from "./IStreamer";

class Streamer implements IStreamer{
    private blips: Blip[] = [];
    createBlip(blip: Blip): void {
        this.blips.push(blip);
        const blipEntity = AddBlipForCoord(blip.position.x, blip.position.y, blip.position.z);
        SetBlipSprite(blipEntity, blip.sprite);
        SetBlipColour(blipEntity, blip.color);
        SetBlipScale(blipEntity, blip.scale);
        SetBlipDisplay(blipEntity, 4);

        BeginTextCommandSetBlipName("STRING");
        AddTextComponentString(blip.name);
        EndTextCommandSetBlipName(blipEntity);
        
    }

    deleteBlip(id: string): void {
        const blip = this.blips.find(b => b.id === id);
        if (blip) {
            const index = this.blips.indexOf(blip);
            if (index > -1) {
                this.blips.splice(index, 1);
            }
        }
    }

    getBlips(): Blip[] {
        return this.blips;
    }
}

export const streamer: IStreamer = new Streamer();