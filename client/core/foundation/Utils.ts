import { eventManager } from "./EventManager";
import { Position } from "@shared/types/Position";

export const Delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const notify = (title: string | null, message: string, color: string = "green", delay = 5000) => {
    PlaySoundFrontend(-1, "DELETE", "HUD_DEATHMATCH_SOUNDSET", true);
    eventManager.emitWebView("notification", JSON.stringify({ title, message, color, delay }));
};

export const DrawText3D = (x, y, z, text, r, g, b, scale) => {
    SetDrawOrigin(x, y, z, 0)
    SetTextFont(0)
    SetTextProportional(false)
    SetTextScale(0, scale || 0.2)
    SetTextColour(r, g, b, 255)
    SetTextDropshadow(0, 0, 0, 0, 255)
    SetTextEdge(2, 0, 0, 0, 150)
    SetTextDropShadow()
    SetTextOutline()
    SetTextEntry("STRING")
    SetTextCentre(true)
    AddTextComponentString(text)
    DrawText(0, 0)
    ClearDrawOrigin()
};

export const Keys = {
    "ESC": 322, "F1": 288, "F2": 289, "F3": 170, "F5": 166, "F6": 167, "F7": 168, "F8": 169, "F9": 56, "F10": 57,
    "~": 243, "1": 157, "2": 158, "3": 160, "4": 164, "5": 165, "6": 159, "7": 161, "8": 162, "9": 163, "-": 84, "=": 83, "BACKSPACE": 177,
    "TAB": 37, "Q": 44, "W": 32, "E": 38, "R": 45, "T": 245, "Y": 246, "U": 303, "P": 199, "[": 39, "]": 40, "ENTER": 18,
    "CAPS": 137, "A": 34, "S": 8, "D": 9, "F": 23, "G": 47, "H": 74, "K": 311, "L": 182,
    "LEFTSHIFT": 21, "Z": 20, "X": 73, "C": 26, "V": 0, "B": 29, "N": 249, "M": 244, ",": 82, ".": 81,
    "LEFTCTRL": 36, "LEFTALT": 19, "SPACE": 22, "RIGHTCTRL": 70,
    "HOME": 213, "PAGEUP": 10, "PAGEDOWN": 11, "DELETE": 178,
    "LEFT": 174, "RIGHT": 175, "TOP": 27, "DOWN": 173,
    "NENTER": 201, "N4": 108, "N5": 60, "N6": 107, "N+": 96, "N-": 97, "N7": 117, "N8": 61, "N9": 118
};


export const  GetCamDirection = () => {
    let heading = GetGameplayCamRelativeHeading() + GetEntityHeading(PlayerPedId())
    let pitch = GetGameplayCamRelativePitch()
    
    let x = -Math.sin(heading * Math.PI / 180.0)
    let y = Math.cos(heading * Math.PI / 180.0)
    let z = Math.sin(pitch * Math.PI / 180.0)
    
    let len = Math.sqrt(x * x + y * y + z * z)
    if (len !== 0) {
        x = x / len
        y = y / len
        z = z / len
    }
    
    return [x, y, z]
}

export const getDistanceBetween =(pos1: Position, pos2: Position): number => {
    return Vdist(pos1.x, pos1.y, pos1.z, pos2.x, pos2.y, pos2.z);
}