import React, { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import { HudProps } from "../@types/HudProps";
import { RadioState } from "../@types/RadioState";

const Hud = forwardRef((_, ref) => {
    const [visible, setVisible] = useState(false);
    const [props, setProps] = useState<HudProps>({
        money: 0,
        isVoiceMuted: true,
        maxVoiceRange: 3,
        radioState: RadioState.NC,
        voiceRange: 0
    });
    const [date, setDate] = useState<string>();

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
                    setProps((props) => ({ ...props, ...args }));
                    break;
                case "updatevoicerange":
                    setProps((props) => ({ ...props, voiceRange: args[0] }));
                    break;
            }
        }
    }));

    useEffect(() => {
        const interval = setInterval(() => {
            const date = new Date();
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            const seconds = date.getSeconds().toString().padStart(2, '0');
            const day = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"][date.getDay()];
            const dayNum = date.getDate();
            const month = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"][date.getMonth()];
            const dateString = `${day}, ${dayNum}. ${month} | ${hours}:${minutes}:${seconds}`;
            setDate((state) => (dateString));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    if (!visible) return null;

    return (
        <div className="fixed right-6 top-20">
            <div className="flex flex-col space-y-2">
                <div className="flex items-center bg-black bg-opacity-85 p-2 rounded-md">
                    <div className="bg-green-600 w-8 h-8 flex items-center justify-center rounded-md shadow-lg">
                        <span className="text-white">$</span>
                    </div>
                    <span className="ml-2 text-white">{props.money}</span>
                </div>
                <div className="bg-black bg-opacity-75 p-2 rounded-md text-white">
                    {date}
                </div>
                <div className="flex space-x-2">
                    <div className={`w-10 h-10 flex items-center justify-center rounded-md ${props.voiceRange === 1 ? 'bg-green-500' : props.voiceRange === 3 ? 'bg-yellow-500' : props.voiceRange === 8 ? 'bg-orange-500' : props.voiceRange === 15 || props.voiceRange === 35 ? 'bg-red-500' : 'bg-gray-500'}`}>
                        <i className={`fas ${props.voiceRange <= 3 ? 'fa-volume-low' : 'fa-volume-high'} text-white`}></i>
                    </div>
                    <div className={`w-10 h-10 flex items-center justify-center rounded-md ${props.radioState === 0 ? 'bg-red-500' : props.radioState === 1 ? 'bg-orange-500' : 'bg-blue-500'}`}>
                        <i className={`fas ${props.radioState === RadioState.NC ? 'fa-microphone-alt-slash' : props.radioState === RadioState.PTT ? 'fa-microphone-alt' : 'fa-microphone'} text-white`}></i>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default Hud;