import React, { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import { useNotification } from "../contexts/notificationContext";
import { fetchNui } from "../utils/fetchNui";

const CharCreator = forwardRef((_, ref) => {
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [state, setState] = useState(true);
  const [charData, setCharData] = useState<any>({});
  const [gender, setGender] = useState<number | null>(null);
  const [heading, setHeading] = useState<number>(0);

  const notification = useNotification();

  useImperativeHandle(ref, () => ({
    show: () => setVisible(true),
    hide: () => setVisible(false),
    emit: (eventName: string, ...args: any[]) => {
      if (eventName === "CHAR_UPDATE") {
        console.log("Charakterdaten aktualisieren mit:", args);
      }
    },
  }));

  useEffect(() => {
    if (charData) {
      for (let id in charData) {
        const input = document.querySelector(`#CharCreatorWindow [data-target="${id}"]`) as HTMLInputElement;
        if (input) {
          input.value = charData[id];
          const target = document.getElementById(id);
          if (target) {
            target.children[0].textContent = `${input.value} | ${input.max}`;
          }
        }
      }
    }
  }, [charData]);

  const setRange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = document.getElementById(e.target.dataset.target!);
    if (target) {
      target.children[0].textContent = `${e.target.value} | ${e.target.max}`;
      fetchNui("setData", [e.target.dataset.target, e.target.value]);
    }
  };

  const handleGenderClick = (gender: number) => {
    setGender(gender);
    fetchNui("setData", ["Gender", gender]);
    
  };

  const handleItemClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const text = e.currentTarget.textContent;
    if (active === text || !text) return;

    setActive(text);
    document.querySelectorAll(".item").forEach(item => item.classList.remove("active"));
    e.currentTarget.classList.add("active");

    document.querySelectorAll(".rightBody .inner").forEach(inner => (inner as HTMLElement).style.display = "none");
    const body = document.getElementById(e.currentTarget.dataset.body!);
    if (body) body.style.display = "block";

    const header = document.querySelector(".rightBody .header");
    if (header) header.textContent = text;
  };

  const handleCancelClick = () => {
    if (!state) {
      fetchNui("ServerEvent", "CharCreator::Close");
    }
  };

  const handleSubmitClick = () => {
    if (state) {
      const birthday = (document.getElementById("birthday") as HTMLInputElement).value;
      const firstname = (document.getElementById("firstname") as HTMLInputElement).value;
      const lastname = (document.getElementById("lastname") as HTMLInputElement).value;

      if (!checkBirthday(birthday)) return notification.showNotification(null, "Ungültiges Geburtsdatum!", "error", 5000);
      if (firstname.length < 3 || firstname.length > 14) return notification.showNotification(null, "Ungültiger Vorname!", "error", 5000);
      if (lastname.length < 3 || lastname.length > 14) return notification.showNotification(null, "Ungültiger Nachname!", "error", 5000);

      fetchNui("endCreator", state, [firstname, lastname, birthday]);
    }
  };

  const checkBirthday = (text: string) => {
    const splits = text.split(".");
    if (splits.length !== 3) return false;
    if (splits[0].length !== 2 || splits[1].length !== 2 || splits[2].length !== 4) return false;
    if (isNaN(parseInt(splits[0])) || isNaN(parseInt(splits[1])) || isNaN(parseInt(splits[2]))) return false;
    if (parseInt(splits[0]) <= 0 || parseInt(splits[0]) > 31) return false;
    if (parseInt(splits[1]) <= 0 || parseInt(splits[1]) > 12) return false;
    if (parseInt(splits[2]) <= 1900 || parseInt(splits[2]) > new Date().getFullYear() - 18) return false;
    return true;
  };

  const setCharCreator = (Argstate: boolean, charData: any = null) => {
    if (charData) {
      setCharData(JSON.parse(charData));
    }
    if (!Argstate) {
      setState(false);
      document.querySelector("#CharCreatorWindow .item:first-child")?.classList.add("hide");
      //document.querySelector("#CharCreatorWindow .leftBody .inner").children[1].dispatchEvent(new MouseEvent("click"));
    }
  };

  const items = [
    { body: "char", label: "Charakter" },
    { body: "kopf", label: "Kopf" },
    { body: "gesicht", label: "Oberes Gesicht" },
    { body: "gesicht2", label: "Unteres Gesicht" },
    { body: "augen", label: "Augen" },
    { body: "frisur", label: "Frisur" },
    { body: "bart", label: "Bart" },
    { body: "sprossen", label: "Sprossen" },
    { body: "alter", label: "Alterung" },
    { body: "makeup", label: "Makeup" },
    { body: "lippenstift", label: "Lippenstift" },
    { body: "blush", label: "Blush" },
  ];

  const renderInputs = (inputs: any[]) => {
    return inputs.map((input, index) => (
      <div className="data" key={index}>
        <span id={input.id} className="input">
          {input.label} <span className="right">{input.right}</span>
        </span>
        <br />
        <input
          onInput={setRange}
          onChange={setRange}
          data-target={input.id}
          step={input.step}
          min={input.min}
          max={input.max}
          defaultValue={input.defaultValue}
          type="range"
        />
      </div>
    ));
  };

  const sections: { [key: string]: { id: string, label: string; placeholder?: string; right?: string; min: string; max: string; defaultValue: string; step?: string }[] } = {
    char: [
      {
        id: "firstname", label: "Vorname", placeholder: "Max",
        min: "",
        max: "",
        defaultValue: ""
      },
      {
        id: "lastname", label: "Nachname", placeholder: "Mustermann",
        min: "",
        max: "",
        defaultValue: ""
      },
      {
        id: "birthday", label: "Geburtsdatum", placeholder: "28.01.1996",
        min: "",
        max: "",
        defaultValue: ""
      },
    ],
    kopf: [
      { id: "shapeFirst", label: "Gesicht Vater", right: "0 | 45", min: "0", max: "45", defaultValue: "0" },
      { id: "shapeSecond", label: "Gesicht Mutter", right: "0 | 45", min: "0", max: "45", defaultValue: "0" },
      { id: "skinFirst", label: "Hautfarbe Vater", right: "0 | 45", min: "0", max: "45", defaultValue: "0" },
      { id: "skinSecond", label: "Hautfarbe Mutter", right: "0 | 45", min: "0", max: "45", defaultValue: "0" },
      { id: "shapeMix", label: "Gesicht Mix", right: "0 | 1", min: "0", max: "1", defaultValue: "0", step: "0.01" },
      { id: "skinMix", label: "Hautfarbe Mix", right: "0 | 1", min: "0", max: "1", defaultValue: "0", step: "0.01" },
    ],
    gesicht: [
      { id: "noseWidth", label: "Nasenbreite", min: "-1", max: "1", defaultValue: "0", step: "0.01" },
      { id: "noseHeight", label: "Nasenhöhe", min: "-1", max: "1", defaultValue: "0", step: "0.01" },
      { id: "noseLength", label: "Nasenlänge", min: "-1", max: "1", defaultValue: "0", step: "0.01" },
      { id: "noseBridge", label: "Nasenrücken", min: "-1", max: "1", defaultValue: "0", step: "0.01" },
      { id: "noseTip", label: "Nasenspitze", min: "-1", max: "1", defaultValue: "0", step: "0.01" },
      { id: "noseBridgeShift", label: "Nasenverkrümmung", min: "-1", max: "1", defaultValue: "0", step: "0.01" },
      { id: "browHeight", label: "Augenbrauenhöhe", min: "-1", max: "1", defaultValue: "0", step: "0.01" },
      { id: "browWidth", label: "Augenbrauenbreite", min: "-1", max: "1", defaultValue: "0", step: "0.01" },
      { id: "cheekBoneHeight", label: "Wangenknochenhöhe", min: "-1", max: "1", defaultValue: "0", step: "0.01" },
      { id: "cheekBoneWidth", label: "Wangenknochenbreite", min: "-1", max: "1", defaultValue: "0", step: "0.01" },
      { id: "cheeksWidth", label: "Wangenbreite", min: "-1", max: "1", defaultValue: "0", step: "0.01" },
    ],
    gesicht2: [
      { id: "eyes", label: "Augen", min: "-1", max: "1", defaultValue: "0", step: "0.01" },
      { id: "lips", label: "Lippen", min: "-1", max: "1", defaultValue: "0", step: "0.01" },
      { id: "jawWidth", label: "Kieferbreite", min: "-1", max: "1", defaultValue: "0", step: "0.01" },
      { id: "jawHeight", label: "Kieferhöhe", min: "-1", max: "1", defaultValue: "0", step: "0.01" },
      { id: "chinLength", label: "Kinnlänge", min: "-1", max: "1", defaultValue: "0", step: "0.01" },
      { id: "chinPosition", label: "Kinnposition", min: "-1", max: "1", defaultValue: "0", step: "0.01" },
      { id: "chinWidth", label: "Kinnbreite", min: "-1", max: "1", defaultValue: "0", step: "0.01" },
      { id: "chinShape", label: "Kinnform", min: "-1", max: "1", defaultValue: "0", step: "0.01" },
      { id: "neckWidth", label: "Nackenbreite", min: "-1", max: "1", defaultValue: "0", step: "0.01" },
    ],
    augen: [
      { id: "eyesColor", label: "Augenfarbe", min: "0", max: "28", defaultValue: "0" },
      { id: "eyeBrows", label: "Augenbrauen", min: "0", max: "33", defaultValue: "0" },
      { id: "eyeBrowsOpacity", label: "Transparenz", min: "0", max: "1", defaultValue: "1", step: "0.01" },
      { id: "eyeBrowsColor", label: "Farbe", min: "0", max: "63", defaultValue: "0" },
    ],
    frisur: [
      { id: "hair", label: "Haare", min: "0", max: "93", defaultValue: "0" },
      { id: "hairColor", label: "Haarfarbe", min: "0", max: "63", defaultValue: "0" },
      { id: "hairColor2", label: "Highlightfarbe", min: "0", max: "63", defaultValue: "0" },
      { id: "chestHair", label: "Brusthaare", min: "0", max: "16", defaultValue: "0" },
      { id: "chestHairOpacity", label: "Transparenz", min: "0", max: "1", defaultValue: "1", step: "0.01" },
      { id: "chestHairColor", label: "Brusthaarfarbe", min: "0", max: "63", defaultValue: "0" },
    ],
    bart: [
      { id: "beardStyle", label: "Style", min: "0", max: "28", defaultValue: "0" },
      { id: "beardOpacity", label: "Transparenz", min: "0", max: "1", defaultValue: "0", step: "0.01" },
      { id: "beardColor", label: "Farbe", min: "0", max: "63", defaultValue: "0" },
    ],
    sprossen: [
      { id: "sprossenStyle", label: "Sommersprossen", min: "0", max: "18", defaultValue: "0" },
      { id: "sprossenOpacity", label: "Transparenz", min: "0", max: "1", defaultValue: "0", step: "0.01" },
    ],
    alter: [
      { id: "ageing", label: "Alterung", min: "0", max: "14", defaultValue: "0" },
    ],
    makeup: [
      { id: "Makeups", label: "Makeup", min: "0", max: "15", defaultValue: "0" },
      { id: "MakeupOpacity", label: "Transparenz", min: "0", max: "1", defaultValue: "0", step: "0.01" },
    ],
    lippenstift: [
      { id: "lipstickColor", label: "Farbe", min: "0", max: "9", defaultValue: "0" },
      { id: "lipstickOpacity", label: "Transparenz", min: "0", max: "1", defaultValue: "0", step: "0.01" },
    ],
    blush: [
      { id: "blushStyle", label: "Blush", min: "0", max: "32", defaultValue: "0" },
      { id: "blushColor", label: "Farbe", min: "0", max: "32", defaultValue: "0" },
      { id: "blushOpacity", label: "Transparenz", min: "0", max: "1", defaultValue: "0", step: "0.01" },
    ],
  };

  return visible ? (
    <div id="CharCreatorWindow">
      <link href="./css/charcreator.css" rel="stylesheet" />
      <div className="leftBody">
        <div className="header">Schönheitsklinik</div>
        <div className="inner">
          {items.map((item, index) => (
            <div
              key={index}
              data-body={item.body}
              className={`item ${active === item.label ? "active" : ""}`}
              onClick={handleItemClick}
            >
              {item.label}
            </div>
          ))}
        </div>
      </div>

      <div className="rightBody">
        <div className="header">{active}</div>
        <div className="body">
          {Object.keys(sections).map((section, index) => (
            <div
              key={index}
              className="inner"
              id={section}
              style={{ display: active === items[index].label ? "block" : "none" }}
            >
              {renderInputs(sections[section as keyof typeof sections])}
            </div>
          ))}
        </div>
      </div>

      <div className="middleBottomBody">
        <input
          type="range"
          onInput={(e) => setHeading(parseInt((e.target as HTMLInputElement).value))}
          onChange={(e) => setHeading(parseInt((e.target as HTMLInputElement).value))}
          min={0}
          max={360}
          className="range"
        />
      </div>

      <div className="rightBottomBody">
        <div className="cancelButton" onClick={handleCancelClick}>
          <i className="fas fa-times-circle"></i>
        </div>
        <div className="submitButton" onClick={handleSubmitClick}>
          Abschließen
        </div>
      </div>
    </div>
  ) : null;
});

export default CharCreator;