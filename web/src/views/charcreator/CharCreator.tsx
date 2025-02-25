"use client"

import { useState, useEffect } from "react"
import { fetchNui } from "../../utils/fetchNui"
import { eventListener } from "../../utils/EventListener"
import {
  Check,
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
} from "lucide-react"

export default function CharCreator() {
  const [visible, setVisible] = useState(false)
  const [usesChar, setUsesChar] = useState(true)
  const [active, setActive] = useState<string | null>(null)
  const [state, setState] = useState(true)
  const [charData, setCharData] = useState<any>({})
  const [gender, setGender] = useState<number | null>(null)
  const [heading, setHeading] = useState<number>(0)

  useEffect(() => {
    const load = async () => {
      const data = await fetchNui("getCharData")
      setCharData(data)
    }

    load()

    eventListener.listen("CharCreator::LoadData", loadCharData)
    return () => {
      eventListener.remove("CharCreator::LoadData")
    }
  }, [])

  const loadCharData = (data: any) => {
    setCharData(data)
  }

  useEffect(() => {
    if (charData) {
      for (const id in charData) {
        const input = document.querySelector(`#CharCreatorWindow [data-target="${id}"]`) as HTMLInputElement
        if (input) {
          input.value = charData[id]
          const target = document.getElementById(id)
          if (target && input.type === "range") {
            target.children[0].textContent = `${input.value} | ${input.max}`
          }
        }
      }
    }
  }, [charData])

  const handleGenderClick = (selectedGender: number) => {
    setGender(selectedGender)
    fetchNui("setData", ["Gender", selectedGender])
  }

  const handleItemClick = (menuItem: string, bodyId: string) => {
    if (active === menuItem) return
    setActive(menuItem)
  }

  const handleSubmit = () => {
    if (state) {
      const birthday = (document.getElementById("birthday") as HTMLInputElement).value
      const firstname = (document.getElementById("firstname") as HTMLInputElement).value
      const lastname = (document.getElementById("lastname") as HTMLInputElement).value

      if (!checkBirthday(birthday)) {
        // Show error notification
        return
      }
      if (firstname.length < 3 || firstname.length > 14) {
        // Show error notification
        return
      }
      if (lastname.length < 3 || lastname.length > 14) {
        // Show error notification
        return
      }

      fetchNui("endCreator", state, [firstname, lastname, birthday])
    }
  }

  const checkBirthday = (text: string) => {
    const splits = text.split(".")
    if (splits.length !== 3) return false
    if (splits[0].length !== 2 || splits[1].length !== 2 || splits[2].length !== 4) return false
    if (isNaN(Number.parseInt(splits[0])) || isNaN(Number.parseInt(splits[1])) || isNaN(Number.parseInt(splits[2])))
      return false
    if (Number.parseInt(splits[0]) <= 0 || Number.parseInt(splits[0]) > 31) return false
    if (Number.parseInt(splits[1]) <= 0 || Number.parseInt(splits[1]) > 12) return false
    if (Number.parseInt(splits[2]) <= 1900 || Number.parseInt(splits[2]) > new Date().getFullYear() - 18) return false
    return true
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

  return (
    <div className="fixed inset-0 flex items-center justify-between px-6">
      {/* Left Sidebar */}
      <div className="w-80 rounded-lg bg-gradient-to-r from-neutral-900/95 to-neutral-800/95 shadow-xl">
        <div className="border-b border-neutral-800 p-4">
          <h2 className="text-center text-lg font-semibold text-red-500">Schönheitsklinik</h2>
        </div>
        <div className="max-h-[70vh] overflow-y-auto py-2">
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
          {active === "Charakter" && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm text-neutral-400">Geschlecht</label>
                <div className="flex gap-4">
                  <button
                    onClick={() => handleGenderClick(0)}
                    className={`flex-1 rounded py-2 text-sm transition-colors
                      ${
                        gender === 0 ? "bg-red-600 text-white" : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
                      }`}
                  >
                    Männlich
                  </button>
                  <button
                    onClick={() => handleGenderClick(1)}
                    className={`flex-1 rounded py-2 text-sm transition-colors
                      ${
                        gender === 1 ? "bg-red-600 text-white" : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
                      }`}
                  >
                    Weiblich
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-neutral-400">Vorname</label>
                <input
                  id="firstname"
                  type="text"
                  className="w-full rounded bg-neutral-800 px-3 py-2 text-sm text-white outline-none ring-red-500 focus:ring-2"
                  placeholder="Vorname eingeben"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-neutral-400">Nachname</label>
                <input
                  id="lastname"
                  type="text"
                  className="w-full rounded bg-neutral-800 px-3 py-2 text-sm text-white outline-none ring-red-500 focus:ring-2"
                  placeholder="Nachname eingeben"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-neutral-400">Geburtsdatum</label>
                <input
                  id="birthday"
                  type="text"
                  className="w-full rounded bg-neutral-800 px-3 py-2 text-sm text-white outline-none ring-red-500 focus:ring-2"
                  placeholder="TT.MM.JJJJ"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="fixed bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-4">
        <button
          onClick={() => fetchNui("ServerEvent", "CharCreator::Close")}
          className="rounded bg-red-500/90 p-2 text-white transition-colors hover:bg-red-600"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="w-80 rounded bg-neutral-900/90 p-3 shadow-xl">
          <input
            type="range"
            min="0"
            max="360"
            value={heading}
            onChange={(e) => setHeading(Number.parseInt(e.target.value))}
            className="w-full appearance-none bg-transparent [&::-webkit-slider-runnable-track]:h-1.5 [&::-webkit-slider-runnable-track]:rounded [&::-webkit-slider-runnable-track]:bg-neutral-800 [&::-webkit-slider-thumb]:mt-[-4px] [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-red-500"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="rounded bg-green-600/90 p-2 text-white transition-colors hover:bg-green-700"
        >
          <Check className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}

