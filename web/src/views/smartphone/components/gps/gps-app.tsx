"use client"
import { useState } from "react"
import { MapPin, Search, ShoppingBag, Car, Gamepad2 } from "lucide-react"
import { fetchNui } from "../../../../utils/fetchNui"

// GPS-Standorte
const gpsLocations = [
  // Garagen
  { id: 1, name: "Legion Square Garage", type: "Garagen" },
  { id: 2, name: "Pillbox Hill Garage", type: "Garagen" },
  { id: 3, name: "Vinewood Garage", type: "Garagen" },
  { id: 4, name: "Sandy Shores Garage", type: "Garagen" },
  { id: 5, name: "Paleto Bay Garage", type: "Garagen" },

  // Shops
  { id: 6, name: "Ammunation Downtown", type: "Shops" },
  { id: 7, name: "Discount Store", type: "Shops" },
  { id: 8, name: "24/7 Supermarkt", type: "Shops" },
  { id: 9, name: "Ponsonbys", type: "Shops" },

  // Spaß
  { id: 10, name: "Maze Bank Arena", type: "Spaß" },
  { id: 11, name: "Del Perro Pier", type: "Spaß" },
  { id: 12, name: "Casino", type: "Spaß" },
  { id: 13, name: "Golfplatz", type: "Spaß" },
]

export default function GpsApp() {
  const [searchTerm, setSearchTerm] = useState("")

  // Gruppiere Standorte nach Typ
  const groupedLocations: Record<string, typeof gpsLocations> = {}

  const filteredLocations = gpsLocations.filter((location) =>
    location.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  filteredLocations.forEach((location) => {
    if (!groupedLocations[location.type]) {
      groupedLocations[location.type] = []
    }
    groupedLocations[location.type].push(location)
  })

  const handleSetNavigation = (locationId: number) => {
    const location = gpsLocations.find((loc) => loc.id === locationId)
    if (location) {
      fetchNui("Smartphone::SetGPS", locationId)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Garagen":
        return <Car size={18} />
      case "Shops":
        return <ShoppingBag size={18} />
      case "Spaß":
        return <Gamepad2 size={18} />
      default:
        return <MapPin size={18} />
    }
  }

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Header */}
      <div className="bg-gray-900 p-3 flex items-center justify-between border-b border-gray-800">
        <h1 className="text-lg font-semibold text-white">GPS</h1>
      </div>

      {/* Suchleiste */}
      <div className="px-4 pt-2 pb-4 bg-gray-900">
        <div className="flex items-center bg-gray-800 rounded-lg px-3 py-2">
          <Search size={16} className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Ziel suchen..."
            className="bg-transparent w-full outline-none text-sm text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* GPS-Liste */}
      <div className="flex-1 overflow-y-auto bg-gray-900">
        {Object.keys(groupedLocations).map((type) => (
          <div key={type} className="mb-2">
            <div className="sticky top-0 bg-gray-800 px-4 py-2 font-medium text-white flex items-center">
              {getTypeIcon(type)}
              <span className="ml-2">{type}</span>
            </div>

            {groupedLocations[type].map((location) => (
              <button
                key={location.id}
                className="flex items-center w-full px-4 py-3 border-b border-gray-800 text-left hover:bg-gray-800 active:bg-gray-700 cursor-pointer"
                onClick={() => handleSetNavigation(location.id)}
              >
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-blue-400 mr-3">
                  <MapPin size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-white">{location.name}</h3>
                </div>
              </button>
            ))}
          </div>
        ))}

        {Object.keys(groupedLocations).length === 0 && (
          <div className="flex flex-col items-center justify-center h-40 text-gray-500">
            <MapPin size={32} className="mb-2" />
            <p>Keine Ergebnisse gefunden</p>
          </div>
        )}
      </div>
    </div>
  )
}
