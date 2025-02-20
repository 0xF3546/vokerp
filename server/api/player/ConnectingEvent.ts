on('playerConnecting', (name: string, setKickReason: any, deferrals: any) => {
    console.log(`Player ${name} is connecting to the server.`)
    deferrals.defer()

    const player = source.toString();

    let licenseIdentifier: any = null;

    for (let i = 0; i < GetNumPlayerIdentifiers(player); i++) {
        const identifier = GetPlayerIdentifier(player, i);
        console.log(identifier);  // Debugging
        if (identifier.includes('license:')) {
            licenseIdentifier = identifier;
        }
    }

    if (licenseIdentifier === null) {
        deferrals.done("You are not connected to Rockstar Games.")
    } else {
        deferrals.done()
    }
})
