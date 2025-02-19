import React, { useState, forwardRef, useImperativeHandle } from "react";
import { HudProps } from "../@types/HudProps";
import { RadioState } from "../@types/RadioState";

const Hud = forwardRef((_, ref) => {
    const [visible, setVisible] = useState(false);
    const [props, setProps] = useState<HudProps>({money: 0, isVoiceMuted: true, maxVoiceRange: 3, radioState: RadioState.NC, voiceRange: 0})

    useImperativeHandle(ref, () => ({
        show: (delay: number) => {
            console.log("Showing HUD");
            setVisible(true);
        },
        hide: (delay: number) => {
            console.log("Hiding HUD");
            setVisible(false);
        },
        emit: (eventName: string, ...args: any[]) => {
            console.log(`Event received: ${eventName}`, args);
            switch (eventName.toLowerCase()) {
                case "updatehud":
                    setProps((props) => ({...props, args}));
                    break;
                case "updatevoicerange":
                    setProps((props) => ({...props, voiceRange: args[0]}))
                    break;
            }
        }
    }));

    if (!visible) return null;

    return (
        <div style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: 'black', color: 'white', padding: '10px' }}>
            HUD is visible!
        </div>
    );
});

export default Hud;