import React, { useState, forwardRef, useImperativeHandle } from "react";

const Hud = forwardRef((_, ref) => {
    const [visible, setVisible] = useState(false);

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