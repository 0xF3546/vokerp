import { useState, useEffect } from "react"
import { fetchNui } from "../../utils/fetchNui"
import {
  ChevronRight,
  User,
  UserCircle2,
  Eye,
  Scissors,
  BeakerIcon as Beard,
  Sparkles,
  Clock,
  Palette,
  Heart,
  Smile,
  X,
  Check,
} from "lucide-react"
import "./charcreator.css"
import { CharCreatorDto } from "@shared/models/CharCreatorDto"
import { Gender } from "@shared/enum/Gender"

export default function CharCreator() {
  const [active, setActive] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [heading, setHeading] = useState<number>(0)
  const [useCreator, setUseCreator] = useState<boolean>(false)
  const [creatorDto, setCreatorDto] = useState<CharCreatorDto>({
    data: "",
    useCreator: false,
    creatorData: {
      gender: 0,
      firstname: "",
      lastname: "",
      dateOfBirth: new Date(),
    },
  });
  const sections: {
    [key: string]: {
      id: string
      label: string
      placeholder?: string
      right?: string
      min: string
      max: string
      defaultValue: string
      step?: string
    }[]
  } = {
    char: [
      { id: "gender", label: "Geschlecht", placeholder: "Männlich/Weiblich", min: "0", max: "1", defaultValue: "0" },
      { id: "firstname", label: "Vorname", placeholder: "Vorname", min: "0", max: "0", defaultValue: "" },
      { id: "lastname", label: "Nachname", placeholder: "Nachname", min: "0", max: "0", defaultValue: "" },
      { id: "birthday", label: "Geburtsdatum", placeholder: "TT.MM.JJJJ", min: "0", max: "0", defaultValue: "" },
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
  }

  useEffect(() => {
    const load = async () => {
      const data: string = await fetchNui("Character::GetCharData");
      console.log(data);
      const charData: CharCreatorDto = JSON.parse(data);
      if (charData.useCreator) {
        setUseCreator(charData.useCreator)
        handleItemClick("Charakter", "char");
        if (charData.creatorData.gender === null) charData.creatorData.gender = 0;
      } else {
        handleItemClick("Kopf", "kopf")
      }
      setCreatorDto((state) => charData);
    }

    load()
  }, [])

  const handleHeadingChange = async (value: number) => {
    setHeading((state) => value);
    await fetchNui("setHeading", heading);
  }

  const handleSliderChange = (id: string, value: string) => {
    fetchNui("ServerEvent", "CharCreator::Change", id, value)
    setCreatorDto({ ...creatorDto, creatorData: { ...creatorDto.creatorData, [id]: value } })
  }

  const handleItemClick = (menuItem: string, sectionId: string) => {
    if (active === menuItem) return
    setActive(menuItem)
    setActiveSection(sectionId)
  }

  const renderSlider = (item: any) => {
    return (
      <div key={item.id} className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm text-neutral-400">{item.label}</label>
          <span className="text-xs text-neutral-500">{item.right || `${item.min} | ${item.max}`}</span>
        </div>
        <input
          type="range"
          min={item.min}
          max={item.max}
          step={item.step || "1"}
          defaultValue={item.defaultValue}
          onChange={(e) => handleSliderChange(item.id, e.target.value)}
          className="w-full appearance-none bg-transparent [&::-webkit-slider-runnable-track]:h-1.5 [&::-webkit-slider-runnable-track]:rounded [&::-webkit-slider-runnable-track]:bg-neutral-800 [&::-webkit-slider-thumb]:mt-[-4px] [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-red-500"
        />
      </div>
    )
  }

  const menuItems = [
    { id: "char", label: "Charakter", icon: User },
    { id: "kopf", label: "Kopf", icon: UserCircle2 },
    { id: "gesicht", label: "Oberes Gesicht", icon: User },
    { id: "gesicht2", label: "Unteres Gesicht", icon: User },
    { id: "augen", label: "Augen", icon: Eye },
    { id: "frisur", label: "Frisur", icon: Scissors },
    { id: "bart", label: "Bart", icon: Beard },
    { id: "sprossen", label: "Sprossen", icon: Sparkles },
    { id: "alter", label: "Alterung", icon: Clock },
    { id: "makeup", label: "Makeup", icon: Palette },
    { id: "lippenstift", label: "Lippenstift", icon: Heart },
    { id: "blush", label: "Blush", icon: Smile },
  ]

  const handleGenderClick = (genderValue: number) => {
    setCreatorDto({ ...creatorDto, creatorData: { ...creatorDto.creatorData, gender: genderValue } })
  }

  const handleSubmit = () => {
    fetchNui("ServerEvent", "CharCreator::Submit", JSON.stringify(creatorDto))
  }

  return (
    <div id="charcreator" className="fixed inset-0 flex items-center justify-between px-6">
      {/* Left Sidebar */}
      <div className="w-80 rounded-lg bg-gradient-to-r from-neutral-900/95 to-neutral-800/95 shadow-xl">
        <div className="border-b border-neutral-800 p-4">
          <h2 className="text-center text-lg font-semibold text-red-500">Schönheitsklinik</h2>
        </div>
        <div className="max-h-[70vh] overflow-y-auto py-2 scrollbar-none">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.label, item.id)}
              className={`flex w-full items-center gap-3 px-4 py-2 text-sm transition-colors
                ${
                  active === item.label
                    ? "bg-gradient-to-r from-red-600 to-red-500 text-white"
                    : "text-neutral-300 hover:bg-neutral-800"
                }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
              <ChevronRight
                className={`ml-auto h-4 w-4 transition-transform
                ${active === item.label ? "rotate-90" : ""}`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Center Space for Character */}
      <div className="flex-1 min-h-screen" />

      {/* Right Panel */}
      <div className="w-80 rounded-lg bg-gradient-to-r from-neutral-900/95 to-neutral-800/95 shadow-xl">
        <div className="border-b border-neutral-800 p-4">
          <h2 className="text-center text-lg font-semibold text-red-500">{active || "Wähle eine Kategorie"}</h2>
        </div>

        <div className="max-h-[70vh] overflow-y-auto p-6">
          {activeSection === "char" && creatorDto && (
            <div className="space-y-6">
              {/* Geschlechter-Buttons nur im Charakter-Bereich */}
              <div className="space-y-2">
                <label className="text-sm text-neutral-400">Geschlecht</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleGenderClick(0)}
                    className={`flex-1 rounded py-2 text-sm transition-colors
                      ${
                        creatorDto.creatorData.gender === 0 ? "bg-red-600 text-white" : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
                      }`}
                  >
                    Männlich
                  </button>
                  <button
                    onClick={() => handleGenderClick(1)}
                    className={`flex-1 rounded py-2 text-sm transition-colors
                      ${
                        creatorDto.creatorData.gender === 1 ? "bg-red-600 text-white" : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
                      }`}
                  >
                    Weiblich
                  </button>
                </div>
              </div>

              {/* Charakter-Eingabefelder */}
              <div className="space-y-2">
                <label className="text-sm text-neutral-400">Vorname</label>
                <input
                  id="firstname"
                  type="text"
                  className="w-full rounded bg-neutral-800 px-3 py-2 text-sm text-white outline-none ring-red-500 focus:ring-2"
                  placeholder="Vorname eingeben"
                  onChange={(e) => setCreatorDto({ ...creatorDto, creatorData: { ...creatorDto.creatorData, firstname: e.target.value } })}
                  />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-neutral-400">Nachname</label>
                <input
                  id="lastname"
                  type="text"
                  className="w-full rounded bg-neutral-800 px-3 py-2 text-sm text-white outline-none ring-red-500 focus:ring-2"
                  placeholder="Nachname eingeben"
                  onChange={(e) => setCreatorDto({ ...creatorDto, creatorData: { ...creatorDto.creatorData, lastname: e.target.value } })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-neutral-400">Geburtsdatum</label>
                <input
                  id="birthday"
                  type="date"
                  className="w-full rounded bg-neutral-800 px-3 py-2 text-sm text-white outline-none ring-red-500 focus:ring-2"
                  placeholder="TT.MM.JJJJ"
                  onChange={(e) => setCreatorDto({ ...creatorDto, creatorData: { ...creatorDto.creatorData, dateOfBirth: new Date(e.target.value) } })}
                />
              </div>
            </div>
          )}

          {/* Andere Sections mit Slidern */}
          {activeSection && activeSection !== "char" && sections[activeSection] && (
            <div className="space-y-6">{sections[activeSection].map(renderSlider)}</div>
          )}
        </div>
      </div>

      {/* Bottom Controls - Verbesserte Buttons */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2">
        <div className="flex items-center gap-4 rounded-lg bg-gradient-to-r from-neutral-900/95 to-neutral-800/95 p-4 shadow-xl">
          <button
            onClick={() => fetchNui("ServerEvent", "CharCreator::Close")}
            className="group flex items-center gap-2 rounded-md bg-gradient-to-r from-red-600 to-red-500 px-4 py-2 text-sm font-medium text-white shadow-lg transition-all hover:from-red-500 hover:to-red-400 hover:shadow-red-500/25 active:scale-95"
          >
            <X className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            <span>Abbrechen</span>
          </button>

          <div className="mx-4 h-8 w-px bg-neutral-800" />

          <div className="w-80">
            <input
              type="range"
              min="0"
              max="360"
              value={heading}
              onChange={(e) => handleHeadingChange(Number.parseInt(e.target.value))}
              className="w-full appearance-none bg-transparent [&::-webkit-slider-runnable-track]:h-1.5 [&::-webkit-slider-runnable-track]:rounded [&::-webkit-slider-runnable-track]:bg-neutral-800 [&::-webkit-slider-thumb]:mt-[-3px] [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-red-500 [&::-webkit-slider-thumb]:shadow-lg hover:[&::-webkit-slider-thumb]:bg-red-400"
            />
          </div>

          <div className="mx-4 h-8 w-px bg-neutral-800" />

          <button
            onClick={handleSubmit}
            className="group flex items-center gap-2 rounded-md bg-gradient-to-r from-green-600 to-green-500 px-4 py-2 text-sm font-medium text-white shadow-lg transition-all hover:from-green-500 hover:to-green-400 hover:shadow-green-500/25 active:scale-95"
          >
            <span>Bestätigen</span>
            <Check className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </div>
  )
}

