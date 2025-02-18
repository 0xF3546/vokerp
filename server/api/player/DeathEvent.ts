interface DeathDataProps {
    killerType: number;
    weaponHash: string;
    killerInVeh: boolean;
    killerVehSeat: number;
    killerVehName: string;
    deathCoords: number[];
}
on('onPlayerKilled', (killerID: string, data: any[]) => {

})