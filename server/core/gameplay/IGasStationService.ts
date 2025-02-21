import { GasStation } from "./impl/GasStation"

export type IGasStationService = {
    getGasStations: () => GasStation[]
    setFuel: (gasStation: GasStation, fuel: number) => void
    load: () => void
    create(gasStation: GasStation): void
}