import { useState, forwardRef, useImperativeHandle, useEffect, useRef } from "react";
import { HudProps } from "../../@types/HudProps";
import { RadioState } from "../../@types/RadioState";
import "./hud.css";
import { ViewComponent } from "../../@types/ViewComponent";
import { ImVolumeHigh, ImVolumeLow, ImVolumeMedium, ImVolumeMute } from "react-icons/im";
import { IoIosRadio } from "react-icons/io";

const Hud = forwardRef<ViewComponent>((_, ref) => {
  const visibleRef = useRef(true); // Verhindert unerwartetes Zurücksetzen
  const [visible, setVisible] = useState(true);
  const [props, setProps] = useState<HudProps>({
    money: 0,
    isVoiceMuted: true,
    maxVoiceRange: 3,
    radioState: RadioState.NC,
    voiceRange: 0,
  });
  const [date, setDate] = useState<string>();

  // Synchronisiert visibleRef mit visible-State
  useEffect(() => {
    if (visibleRef.current !== visible) {
      setVisible(visibleRef.current);
    }
  }, [visible]);

  useImperativeHandle(ref, () => ({
    show: (delay: number = 0) => {
      console.log("Showing HUD with delay:", delay);
      visibleRef.current = true;
      setTimeout(() => {
        setVisible(true);
        console.log("HUD is now visible after delay");
      }, delay);
    },
    hide: (delay: number = 0) => {
      console.log("Hiding HUD with delay:", delay);
      visibleRef.current = false;
      setTimeout(() => {
        setVisible(false);
        console.log("HUD is now hidden after delay");
      }, delay);
    },
    emit: (eventName: string, ...args: any[]) => {
      console.log(`Event received: ${eventName}`, args);
      switch (eventName.toLowerCase()) {
        case "updatehud":
          setProps((prevProps) => ({ ...prevProps, ...args }));
          break;
        case "updatevoicerange":
          setProps((prevProps) => ({ ...prevProps, voiceRange: args[0] }));
          break;
      }
    },
  }));

  // Stack-Trace zur Fehleranalyse
  useEffect(() => {
    if (visible) {
      console.log("HUD is now visible");
    } else {
      console.log("HUD is now hidden");
      console.trace();
    }
  }, [visible]);

  useEffect(() => {
    const interval = setInterval(() => {
      const date = new Date();
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      const seconds = date.getSeconds().toString().padStart(2, "0");
      const day = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"][date.getDay()];
      const dayNum = date.getDate();
      const month = [
        "Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember",
      ][date.getMonth()];
      const dateString = `${day}, ${dayNum}. ${month} | ${hours}:${minutes}:${seconds}`;
      setDate(dateString);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!visible) return null;

  const getVolumeIcon = () => {
    if (props.isVoiceMuted) return <ImVolumeMute />
    switch (props.voiceRange) {
      case 32:
        <ImVolumeHigh />
        break;
      case 16:
        <ImVolumeHigh />
        break;
      case 8:
        <ImVolumeMedium />
        break;
      case 3:
        <ImVolumeLow />
        break;
      default:
        return <ImVolumeLow /> 
    }
  }

  const getRadioIcon = () => {
    return <IoIosRadio />
  }

  return (
    <div className="playerHud">
      <div className="moneyBody">
        <div className="inner">
          <div className="logo">$</div>
          <span id="money">{props.money.toLocaleString()}</span>
        </div>
      </div>
      <div className="dateBody">
        <div id="uiDate" className="inner">{date}</div>
      </div>

      <div className="voiceBody">
        <div id="voiceRange">{getVolumeIcon()}</div>
      </div>

      <div className="talkingBody">
        <img src="./images/ui/talking.gif" />
      </div>

      <div className="funkBody">
        <div id="funkRange">{getRadioIcon()}</div>
      </div>
    </div>
  );
});

export default Hud;
