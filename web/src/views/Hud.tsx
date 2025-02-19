import { useState, forwardRef, useImperativeHandle } from "react";
import { HudProps } from "../@types/HudProps";

const Hud = forwardRef((_, ref) => {
    const [visible, setVisible] = useState(false);
    const [props, setProps] = useState<HudProps>({money: 0});

    const handleEvent = (eventName: string, ...args: any[]) => {
        if (eventName === "setMoney") {
            console.log("Charakterdaten aktualisieren mit:", args);
        }
    };

    useImperativeHandle(ref, () => ({
        show: (delay: number) => setVisible(true),
        hide: (delay: number) => setVisible(false),
        emit: handleEvent
    }));

    if (!visible) return null;

    return (
        <div>
            Money: {props.money}
        </div>
    );
});

export default Hud;
