import { useState } from "react"
import { ChevronRight, X, Check, Skull, Heart, Sword, BirdIcon as Dragon, Search } from "lucide-react"

interface TattooOption {
  id: number
  collection: string
  name: string
  label: string
  price: number
}

const tattooSections = {
  head: [
    { id: 1, collection: "mpbeach_overlays", name: "MP_Bea_M_Head_000", label: "Tribal Kopf", price: 1200 },
    { id: 2, collection: "mpbeach_overlays", name: "MP_Bea_M_Neck_000", label: "Schlange Nacken", price: 1100 },
    { id: 3, collection: "mphipster_overlays", name: "FM_Hip_M_Tat_005", label: "Drache Nacken", price: 1500 },
  ],
  arms: [
    { id: 4, collection: "mpbusiness_overlays", name: "MP_Buis_M_LeftArm_000", label: "Tribal Arm Links", price: 1800 },
    {
      id: 5,
      collection: "mpbusiness_overlays",
      name: "MP_Buis_M_RightArm_000",
      label: "Tribal Arm Rechts",
      price: 1800,
    },
    { id: 6, collection: "mphipster_overlays", name: "FM_Hip_M_Tat_012", label: "Rose Arm", price: 1600 },
  ],
  torso: [
    { id: 7, collection: "mpbusiness_overlays", name: "MP_Buis_M_Back_000", label: "Drache Rücken", price: 2500 },
    { id: 8, collection: "mpbusiness_overlays", name: "MP_Buis_M_Chest_000", label: "Löwe Brust", price: 2200 },
    { id: 9, collection: "mphipster_overlays", name: "FM_Hip_M_Tat_000", label: "Anker Brust", price: 1900 },
  ],
  legs: [
    { id: 10, collection: "mpbeach_overlays", name: "MP_Bea_M_Leg_000", label: "Tribal Bein", price: 1700 },
    { id: 11, collection: "mphipster_overlays", name: "FM_Hip_M_Tat_042", label: "Schlange Bein", price: 1600 },
    { id: 12, collection: "mpbusiness_overlays", name: "MP_Buis_M_Leg_000", label: "Drache Bein", price: 1900 },
  ],
}

const menuItems = [
  { id: "head", label: "Kopf & Nacken", icon: Skull },
  { id: "arms", label: "Arme", icon: Sword },
  { id: "torso", label: "Torso", icon: Dragon },
  { id: "legs", label: "Beine", icon: Heart },
]

// Declare fetchNui
declare function fetchNui(eventName: string, data?: any): void

export default function TattooStudio() {
  const [active, setActive] = useState<string>("head")
  const [heading, setHeading] = useState(0)
  const [selectedTattoos, setSelectedTattoos] = useState<number[]>([])
  const [totalPrice, setTotalPrice] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")

  const handleHeadingChange = async (value: number) => {
    setHeading(value)
    await fetchNui("setHeading", value)
  }

  const handleTattooToggle = (tattoo: TattooOption) => {
    setSelectedTattoos((prev) => {
      const newSelection = prev.includes(tattoo.id) ? prev.filter((id) => id !== tattoo.id) : [...prev, tattoo.id]

      // Berechne den neuen Gesamtpreis
      const newTotal = Object.values(tattooSections)
        .flat()
        .filter((t) => newSelection.includes(t.id))
        .reduce((sum, t) => sum + t.price, 0)

      setTotalPrice(newTotal)
      return newSelection
    })

    // Sende die Änderung an den Server
    fetchNui("TattooShop::UpdateTattoo", {
      collection: tattoo.collection,
      name: tattoo.name,
      applied: !selectedTattoos.includes(tattoo.id),
    })
  }

  const handleSave = () => {
    fetchNui("TattooShop::Save", {
      tattoos: selectedTattoos,
      totalPrice,
    })
  }

  return (
    <div className="fixed inset-0 flex items-center justify-between px-6">
      {/* Linke Sidebar */}
      <div className="w-80 rounded-lg bg-gradient-to-r from-neutral-900/95 to-neutral-800/95 shadow-xl">
        <div className="border-b border-neutral-800 p-4">
          <h2 className="text-center text-lg font-semibold text-red-500">Tattoo Studio</h2>
        </div>
        <div className="max-h-[70vh] overflow-y-auto py-2 scrollbar-none">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className={`flex w-full items-center gap-3 px-4 py-2 text-sm transition-colors
                ${
                  active === item.id
                    ? "bg-gradient-to-r from-red-600 to-red-500 text-white"
                    : "text-neutral-300 hover:bg-neutral-800"
                }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
              <ChevronRight
                className={`ml-auto h-4 w-4 transition-transform
                ${active === item.id ? "rotate-90" : ""}`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Mittlerer Bereich für Charaktervorschau */}
      <div className="flex-1 min-h-screen" />

      {/* Rechte Sidebar */}
      <div className="w-80 rounded-lg bg-gradient-to-r from-neutral-900/95 to-neutral-800/95 shadow-xl">
        <div className="border-b border-neutral-800 p-4">
          <h2 className="text-center text-lg font-semibold text-red-500">
            {menuItems.find((item) => item.id === active)?.label || "Wähle eine Kategorie"}
          </h2>
          <div className="mt-4 relative">
            <input
              type="text"
              placeholder="Tattoo suchen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-800/50 text-white rounded-md px-3 py-1.5 pl-9 text-sm placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-red-500"
            />
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          </div>
        </div>

        <div className="max-h-[70vh] overflow-y-auto p-4">
          <div className="grid gap-2">
            {tattooSections[active as keyof typeof tattooSections]
              ?.filter((tattoo) => tattoo.label.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((tattoo) => (
                <div
                  key={tattoo.id}
                  className={`flex items-center justify-between rounded-md p-2 transition-colors cursor-pointer text-sm
                    ${
                      selectedTattoos.includes(tattoo.id)
                        ? "bg-red-500/20 hover:bg-red-500/30"
                        : "bg-neutral-800/50 hover:bg-neutral-800"
                    }`}
                  onClick={() => handleTattooToggle(tattoo)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md bg-neutral-900/50 flex items-center justify-center">
                      {selectedTattoos.includes(tattoo.id) ? (
                        <Check className="h-4 w-4 text-red-500" />
                      ) : (
                        <div className="h-4 w-4 rounded-sm border border-neutral-600" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-white text-sm">{tattoo.label}</div>
                      <div className="text-xs text-neutral-400">${tattoo.price}</div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Untere Steuerung */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2">
        <div className="flex items-center gap-4 rounded-lg bg-gradient-to-r from-neutral-900/95 to-neutral-800/95 p-4 shadow-xl">
          <button
            onClick={() => fetchNui("TattooShop::Close")}
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
              onChange={(e) => handleHeadingChange(Number(e.target.value))}
              className="w-full appearance-none bg-transparent [&::-webkit-slider-runnable-track]:h-1.5 [&::-webkit-slider-runnable-track]:rounded [&::-webkit-slider-runnable-track]:bg-neutral-800 [&::-webkit-slider-thumb]:mt-[-4px] [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-red-500"
            />
          </div>

          <div className="mx-4 h-8 w-px bg-neutral-800" />

          <div className="flex items-center gap-4">
            <span className="text-sm text-neutral-400">Gesamtpreis:</span>
            <span className="text-lg font-semibold text-white">${totalPrice}</span>
          </div>

          <button
            onClick={handleSave}
            disabled={selectedTattoos.length === 0}
            className="group flex items-center gap-2 rounded-md bg-gradient-to-r from-green-600 to-green-500 px-4 py-2 text-sm font-medium text-white shadow-lg transition-all hover:from-green-500 hover:to-green-400 hover:shadow-green-500/25 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Check className="h-4 w-4" />
            <span>Kaufen</span>
          </button>
        </div>
      </div>
    </div>
  )
}

