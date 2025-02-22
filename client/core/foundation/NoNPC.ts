setInterval(() => {
    SetCreateRandomCops(false);
    SetCreateRandomCopsNotOnScenarios(false);
    SetCreateRandomCopsOnScenarios(false);
    SetGarbageTrucks(false);
    SetRandomBoats(false);
    SetVehicleDensityMultiplierThisFrame(0.0);
    SetPedDensityMultiplierThisFrame(0.0);
    SetRandomVehicleDensityMultiplierThisFrame(0.0);
    SetScenarioPedDensityMultiplierThisFrame(0.0, 0.0);
    SetParkedVehicleDensityMultiplierThisFrame(0.0);

    const playerPed = PlayerPedId();
    const [x, y, z] = GetEntityCoords(playerPed, true);
    ClearAreaOfVehicles(x, y, z, 1000, false, false, false, false, false);
    RemoveVehiclesFromGeneratorsInArea(x - 500.0, y - 500.0, z - 500.0, x + 500.0, y + 500.0, z + 500.0, 0);
}, 100);