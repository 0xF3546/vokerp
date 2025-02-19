import React, { useState, forwardRef, useImperativeHandle } from "react";

const CharCreator = forwardRef((_, ref) => {
    const [visible, setVisible] = useState(false);

    const handleEvent = (eventName: string, ...args: any[]) => {
        console.log(`Event empfangen: ${eventName}`, ...args);

        if (eventName === "CHAR_UPDATE") {
            console.log("Charakterdaten aktualisieren mit:", args);
        }
    };

    useImperativeHandle(ref, () => ({
        show: () => setVisible(true),
        hide: () => setVisible(false),
        emit: handleEvent
    }));

    if (!visible) return null;

    return (
        <div>
            <h2>CharCreator UI</h2>
            <p>Hier kommen die Inhalte des CharCreators hin!</p>
        </div>
    );
});

export default CharCreator;
