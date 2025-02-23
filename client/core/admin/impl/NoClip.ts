import { Delay, DrawText3D, GetCamDirection, Keys } from "client/core/foundation/Utils";
import { player } from "client/core/Player/impl/Player";

let invis = false;
let currentNoclipSpeed = 1;
let oldSpeed = 1;
let espDistance = 10; // Adjust as needed
let showNames = true; // Adjust as needed
let headDots = true; // Adjust as needed
let health = true; // Adjust as needed

export const toggleNoClip = () => {
    player.noClip = !player.noClip;
    invis = player.noClip;

    if (player.noClip) {
        TriggerEvent('notifications', "#52e6af", "Administration", "Du hast deinen NoClip aktiviert.");
    } else {
        TriggerEvent('notifications', "#52e6af", "Administration", "Du hast deinen NoClip deaktiviert.");
    }
};

(async () => {
    while (true) {
        await Delay(1);

        if (IsDisabledControlJustPressed(0, 19) && player.aduty) {
            toggleNoClip();
        }

        if (player.aduty) {
            SetPedCanRagdoll(GetPlayerPed(-1), false)
			SetEntityCanBeDamaged(GetPlayerPed(-1), false)
        } else {
            SetPedCanRagdoll(GetPlayerPed(-1), true)
			SetEntityCanBeDamaged(GetPlayerPed(-1), true)
        }

        if (player.noClip) {
            const isInVehicle = IsPedInAnyVehicle(player.ped, false);
            let entity = isInVehicle ? GetVehiclePedIsIn(player.ped, false) : player.ped;
            let coords = GetEntityCoords(entity, !isInVehicle);
            let x = coords[0];
            let y = coords[1];
            let z = coords[2];

            const camDirection = GetCamDirection();
            const dx = camDirection[0];
            const dy = camDirection[1];
            const dz = camDirection[2];

            SetEntityVelocity(entity, 0.0001, 0.0001, 0.0001);

            if (IsDisabledControlJustPressed(0, Keys["LEFTSHIFT"])) {
                oldSpeed = currentNoclipSpeed;
                currentNoclipSpeed *= 3;
            }
            if (IsDisabledControlJustReleased(0, Keys["LEFTSHIFT"])) {
                currentNoclipSpeed = oldSpeed;
            }

            if (IsDisabledControlPressed(0, 32)) {
                x += currentNoclipSpeed * dx;
                y += currentNoclipSpeed * dy;
                z += currentNoclipSpeed * dz;
            }

            if (IsDisabledControlPressed(0, 269)) {
                x -= currentNoclipSpeed * dx;
                y -= currentNoclipSpeed * dy;
                z -= currentNoclipSpeed * dz;
            }

            if (IsDisabledControlPressed(0, Keys["SPACE"])) {
                z += currentNoclipSpeed;
            }

            if (IsDisabledControlPressed(0, Keys["LEFTCTRL"])) {
                z -= currentNoclipSpeed;
            }

            SetEntityCoordsNoOffset(entity, x, y, z, true, true, true);
        }

        if (invis) {
            SetEntityVisible(player.ped, false, false);
        } else {
            SetEntityVisible(player.ped, true, false);
        }

        const players = GetActivePlayers();
        for (let i = 0; i < players.length; i++) {
            const currentPlayer = players[i];
            const ped = GetPlayerPed(currentPlayer);

            const headPos = GetPedBoneCoords(ped, 0x796E, 0, 0, 0);
            const playerCoords = GetEntityCoords(player.ped, true);
            const distance = GetDistanceBetweenCoords(headPos[0], headPos[1], headPos[2], playerCoords[0], playerCoords[1], playerCoords[2], false);

            if (ped !== player.ped && distance < espDistance) {
                if (showNames) {
                    DrawText3D(headPos[0], headPos[1], headPos[2] + 0.3, `[${GetPlayerServerId(currentPlayer)}] ${GetPlayerName(currentPlayer)}`, 255, 255, 255, 0.25);
                }
                if (headDots) {
                    DrawText3D(headPos[0], headPos[1], headPos[2] + 0.1, ".", 255, 255, 255, 0.5);
                }
                if (health) {
                    const cK = GetOffsetFromEntityInWorldCoords(ped, 0.75, 0.0, -0.8);
                    const cL = GetOffsetFromEntityInWorldCoords(ped, 0.75, 0.0, 0.6);
                    const [be, cu, cv] = GetScreenCoordFromWorldCoord(cK[0], cK[1], cK[2]);
                    if (be) {
                        const [be2, cM, cN] = GetScreenCoordFromWorldCoord(cL[0], cL[1], cL[2]);
                        if (be2) {
                            const az = cv - cN;
                            const cU = (GetEntityHealth(ped) - 100) / 400;
                            const cUd = GetPedArmour(ped) / 400;

                            if (cU > 0) {
                                DrawRect(cu, cv - az / 2, 0.005 * az, az * cU * 4, 33, 255, 33, 255);
                            }
                            if (cUd > 0) {
                                DrawRect(cu - 0.005, cv - az / 2, 0.005 * az, az * cUd * 4, 0, 0, 255, 255);
                            }
                        }
                    }
                }
            }
        }
    }
})();