"use client"
import { useState } from "react"
import { Car, MapPin, Fuel, Activity, Search, Info, Navigation, ArrowLeft } from "lucide-react"
import type { Vehicle } from "../../types"

interface VehiclesAppProps {
  vehicles: Vehicle[]
  locateVehicle: (id: number) => void
}

export default function VehiclesApp({ vehicles, locateVehicle }: VehiclesAppProps) {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [view, setView] = useState<"list" | "detail">("list")
  const [searchTerm, setSearchTerm] = useState("")

  const handleSelectVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle)
    setView("detail")
  }

  const filteredVehicles = vehicles.filter(
    (vehicle) =>
      vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.garage.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (vehicle.note && vehicle.note.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Header */}
      <div className="bg-gray-900 p-3 flex items-center justify-between border-b border-gray-800">
        {view === "detail" ? (
          <button onClick={() => setView("list")} className="text-blue-400 w-8 h-8 flex items-center justify-center">
            <ArrowLeft size={16} />
          </button>
        ) : (
          <h1 className="text-base font-semibold text-white">Fahrzeuge</h1>
        )}

        {view === "detail" && <h1 className="text-base font-semibold text-white">Details</h1>}
      </div>

      {view === "list" && (
        <>
          {/* Suchleiste */}
          <div className="px-3 pt-2 pb-3 bg-gray-900">
            <div className="flex items-center bg-gray-800 rounded-lg px-3 py-2">
              <Search size={14} className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Suchen..."
                className="bg-transparent w-full outline-none text-xs text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto bg-gray-900">
            {filteredVehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                onClick={() => handleSelectVehicle(vehicle)}
                className="flex items-center px-3 py-2 border-b border-gray-800 active:bg-gray-800"
              >
                <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-blue-400 mr-2">
                  <Car size={16} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xs font-medium text-white">{vehicle.name}</h3>
                  <div className="flex items-center text-xs text-gray-400">
                    <span>{vehicle.garage}</span>
                    <span className="mx-1">•</span>
                    <span>{vehicle.plate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {view === "detail" && selectedVehicle && (
        <div className="flex-1 flex flex-col bg-gray-900 overflow-hidden">
          {/* Scrollbarer Bereich für Fahrzeugdetails */}
          <div className="flex-1 overflow-y-auto">
            {/* Fahrzeug-Header */}
            <div className="p-4 flex flex-col items-center border-b border-gray-800">
              <div className="w-14 h-14 rounded-full bg-gray-800 flex items-center justify-center text-blue-400 mb-2">
                <Car size={24} />
              </div>
              <h2 className="text-base font-semibold text-white">{selectedVehicle.name}</h2>
              <p className="text-xs text-gray-400 mt-1">{selectedVehicle.plate}</p>
              <div className="mt-2 px-2 py-1 rounded-full text-xs bg-gray-800 text-gray-300">
                {selectedVehicle.type}
              </div>
            </div>

            {/* Fahrzeug-Details */}
            <div className="p-3 space-y-3">
              <div className="flex items-center p-2 bg-gray-800 rounded-lg">
                <MapPin className="text-blue-400 mr-2" size={14} />
                <div className="flex-1">
                  <div className="text-xs text-gray-400">Garage</div>
                  <div className="text-xs font-medium text-white">{selectedVehicle.garage}</div>
                </div>
              </div>

              <div className="flex items-center p-2 bg-gray-800 rounded-lg">
                <Fuel className="text-blue-400 mr-2" size={14} />
                <div className="flex-1">
                  <div className="text-xs text-gray-400">Tankstand</div>
                  <div className="text-xs font-medium text-white">{selectedVehicle.fuel}%</div>
                </div>
                <div className="w-12 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      selectedVehicle.fuel > 70
                        ? "bg-green-500"
                        : selectedVehicle.fuel > 30
                          ? "bg-yellow-500"
                          : "bg-red-500"
                    }`}
                    style={{ width: `${selectedVehicle.fuel}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center p-2 bg-gray-800 rounded-lg">
                <Activity className="text-blue-400 mr-2" size={14} />
                <div className="flex-1">
                  <div className="text-xs text-gray-400">Zustand</div>
                  <div className="text-xs font-medium text-white">{selectedVehicle.health}%</div>
                </div>
                <div className="w-12 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      selectedVehicle.health > 70
                        ? "bg-green-500"
                        : selectedVehicle.health > 30
                          ? "bg-yellow-500"
                          : "bg-red-500"
                    }`}
                    style={{ width: `${selectedVehicle.health}%` }}
                  />
                </div>
              </div>

              {selectedVehicle.note && (
                <div className="flex items-start p-2 bg-gray-800 rounded-lg">
                  <Info className="text-blue-400 mr-2 mt-0.5" size={14} />
                  <div className="flex-1">
                    <div className="text-xs text-gray-400">Notiz</div>
                    <div className="text-xs font-medium text-white">{selectedVehicle.note}</div>
                  </div>
                </div>
              )}

              {/* Zusätzliche Informationen für mehr Scrollinhalt */}
              <div className="flex items-start p-2 bg-gray-800 rounded-lg">
                <div className="text-blue-400 mr-2 mt-0.5" size={14}>
                  <Car size={14} />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-gray-400">Fahrzeugtyp</div>
                  <div className="text-xs font-medium text-white">{selectedVehicle.type}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Orten-Button - außerhalb des scrollbaren Bereichs */}
          <div className="p-3 border-t border-gray-800">
            <button
              onClick={() => locateVehicle(selectedVehicle.id)}
              className="w-full py-2 text-xs text-center bg-blue-600 text-white font-medium rounded-lg flex items-center justify-center"
            >
              <Navigation className="mr-2" size={14} />
              Fahrzeug orten
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
