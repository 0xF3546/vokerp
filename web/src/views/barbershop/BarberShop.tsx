import { useState } from "react"
import { Scissors, BeakerIcon as Beard, ChevronRight, X, DollarSign } from "lucide-react"

export default function Barbershop() {
  const [activeCategory, setActiveCategory] = useState<string>("hair")
  const [heading, setHeading] = useState<number>(0)
  const [originalValues, setOriginalValues] = useState({
    hair: 0,
    hairColor: 0,
    hairColor2: 0,
    beardStyle: 0,
    beardOpacity: 1,
    beardColor: 0,
    chestHair: 0,
    chestHairOpacity: 1,
    chestHairColor: 0,
  })
  const [values, setValues] = useState({
    hair: 0,
    hairColor: 0,
    hairColor2: 0,
    beardStyle: 0,
    beardOpacity: 1,
    beardColor: 0,
    chestHair: 0,
    chestHairOpacity: 1,
    chestHairColor: 0,
  })

  // Preise für verschiedene Änderungen
  const prices = {
    haircut: 150, // Grundpreis für Haarschnitt
    hairColor: 75, // Preis pro Farbänderung
    beard: 50, // Grundpreis für Bartänderung
    chestHair: 75, // Grundpreis für Brusthaarbearbeitung
  }

  const calculateTotalPrice = () => {
    let total = 0

    // Überprüfe Haaränderungen
    if (values.hair !== originalValues.hair) {
      total += prices.haircut
    }
    if (values.hairColor !== originalValues.hairColor || values.hairColor2 !== originalValues.hairColor2) {
      total += prices.hairColor
    }

    // Überprüfe Bartänderungen
    if (
      values.beardStyle !== originalValues.beardStyle ||
      values.beardOpacity !== originalValues.beardOpacity ||
      values.beardColor !== originalValues.beardColor
    ) {
      total += prices.beard
    }

    // Überprüfe Brusthaaränderungen
    if (
      values.chestHair !== originalValues.chestHair ||
      values.chestHairOpacity !== originalValues.chestHairOpacity ||
      values.chestHairColor !== originalValues.chestHairColor
    ) {
      total += prices.chestHair
    }

    return total
  }

  const handleSliderChange = (id: string, value: string) => {
    setValues((prev) => ({ ...prev, [id]: value }))
    // fetchNui("ServerEvent", "Barbershop::Change", id, value)
  }

  const handlePurchase = () => {
    const totalPrice = calculateTotalPrice()
    // fetchNui("ServerEvent", "Barbershop::Purchase", { changes: values, price: totalPrice })
  }

  const categories = [
    { id: "hair", label: "Haare", icon: Scissors },
    { id: "beard", label: "Bart", icon: Beard },
    { id: "chest", label: "Brustbehaarung", icon: Scissors },
  ]

  const sections = {
    hair: [
      { id: "hair", label: "Frisur", min: "0", max: "93", defaultValue: "0" },
      { id: "hairColor", label: "Haarfarbe", min: "0", max: "63", defaultValue: "0" },
      { id: "hairColor2", label: "Highlightfarbe", min: "0", max: "63", defaultValue: "0" },
    ],
    beard: [
      { id: "beardStyle", label: "Bart Style", min: "0", max: "28", defaultValue: "0" },
      { id: "beardOpacity", label: "Transparenz", min: "0", max: "1", defaultValue: "1", step: "0.01" },
      { id: "beardColor", label: "Bartfarbe", min: "0", max: "63", defaultValue: "0" },
    ],
    chest: [
      { id: "chestHair", label: "Brusthaare", min: "0", max: "16", defaultValue: "0" },
      { id: "chestHairOpacity", label: "Transparenz", min: "0", max: "1", defaultValue: "1", step: "0.01" },
      { id: "chestHairColor", label: "Farbe", min: "0", max: "63", defaultValue: "0" },
    ],
  }

  const renderSlider = (item: any) => {
    return (
      <div key={item.id} className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm text-neutral-400">{item.label}</label>
          <span className="text-xs text-neutral-500">{values[item.id as keyof typeof values]}</span>
        </div>
        <input
          type="range"
          min={item.min}
          max={item.max}
          step={item.step || "1"}
          value={values[item.id as keyof typeof values]}
          onChange={(e) => handleSliderChange(item.id, e.target.value)}
          className="w-full appearance-none bg-transparent [&::-webkit-slider-runnable-track]:h-1.5 [&::-webkit-slider-runnable-track]:rounded [&::-webkit-slider-runnable-track]:bg-neutral-800 [&::-webkit-slider-thumb]:mt-[-4px] [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-red-500"
        />
      </div>
    )
  }

  const hasChanges = calculateTotalPrice() > 0

  return (
    <div className="fixed inset-0 flex items-center justify-between px-6">
      {/* Left Sidebar */}
      <div className="w-80 rounded-lg bg-gradient-to-r from-neutral-900/95 to-neutral-800/95 shadow-xl">
        <div className="border-b border-neutral-800 p-4">
          <h2 className="text-center text-lg font-semibold text-red-500">Barbershop</h2>
        </div>
        <div className="max-h-[70vh] overflow-y-auto py-2 scrollbar-none">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex w-full items-center gap-3 px-4 py-2 text-sm transition-colors
                ${
                  activeCategory === category.id
                    ? "bg-gradient-to-r from-red-600 to-red-500 text-white"
                    : "text-neutral-300 hover:bg-neutral-800"
                }`}
            >
              <category.icon className="h-4 w-4" />
              {category.label}
              <ChevronRight
                className={`ml-auto h-4 w-4 transition-transform
                ${activeCategory === category.id ? "rotate-90" : ""}`}
              />
            </button>
          ))}
        </div>

        {/* Price List */}
        <div className="border-t border-neutral-800 p-4">
          <h3 className="text-sm font-medium text-neutral-400 mb-2">Preisliste:</h3>
          <div className="space-y-1 text-sm text-neutral-500">
            <div className="flex justify-between">
              <span>Haarschnitt:</span>
              <span>${prices.haircut}</span>
            </div>
            <div className="flex justify-between">
              <span>Färbung:</span>
              <span>${prices.hairColor}</span>
            </div>
            <div className="flex justify-between">
              <span>Bart:</span>
              <span>${prices.beard}</span>
            </div>
            <div className="flex justify-between">
              <span>Brusthaare:</span>
              <span>${prices.chestHair}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Center Space for Character */}
      <div className="flex-1 min-h-screen" />

      {/* Right Panel */}
      <div className="w-80 rounded-lg bg-gradient-to-r from-neutral-900/95 to-neutral-800/95 shadow-xl">
        <div className="border-b border-neutral-800 p-4">
          <h2 className="text-center text-lg font-semibold text-red-500">
            {categories.find((c) => c.id === activeCategory)?.label || "Wähle eine Kategorie"}
          </h2>
        </div>
        <div className="max-h-[70vh] overflow-y-auto p-6">
          <div className="space-y-6">{sections[activeCategory as keyof typeof sections].map(renderSlider)}</div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2">
        <div className="flex items-center gap-4 rounded-lg bg-gradient-to-r from-neutral-900/95 to-neutral-800/95 p-4 shadow-xl">
          <button
            onClick={() => {
              // fetchNui("ServerEvent", "Barbershop::Close")
            }}
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
              onChange={(e) => {
                const value = Number(e.target.value)
                setHeading(value)
                // fetchNui("setHeading", value)
              }}
              className="w-full appearance-none bg-transparent [&::-webkit-slider-runnable-track]:h-1.5 [&::-webkit-slider-runnable-track]:rounded [&::-webkit-slider-runnable-track]:bg-neutral-800 [&::-webkit-slider-thumb]:mt-[-4px] [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-red-500"
            />
          </div>

          <div className="mx-4 h-8 w-px bg-neutral-800" />

          <button
            onClick={handlePurchase}
            disabled={!hasChanges}
            className={`group flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium text-white shadow-lg transition-all active:scale-95
  ${
    hasChanges
      ? "bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 hover:shadow-green-500/25"
      : "bg-neutral-700 cursor-not-allowed"
  }`}
          >
            <DollarSign className="h-4 w-4" />
            <span>Kaufen (${calculateTotalPrice()})</span>
          </button>
        </div>
      </div>
    </div>
  )
}

