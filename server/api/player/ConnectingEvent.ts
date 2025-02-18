on('playerConnecting', (name: string, setKickReason: any, deferrals: any) => {
    deferrals.defer()

    const player = source.toString();

    setTimeout(() => {
        deferrals.update(`Hello ${name}. Your steam ID is being checked.`)

        let steamIdentifier: any = null;

        for (let i = 0; i < GetNumPlayerIdentifiers(player); i++) {
            const identifier = GetPlayerIdentifier(player, i);

            if (identifier.includes('steam:')) {
                steamIdentifier = identifier;
            }
        }

        // pretend to be a wait
        setTimeout(() => {
            if (steamIdentifier === null) {
                deferrals.done("You are not connected to Steam.")
            } else {
                deferrals.done()
            }
        }, 0)
    }, 0)
})