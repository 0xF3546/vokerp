import { useEffect, useState } from "react"
import { Search, Car, ParkingSquare, X, Star, AlertCircle } from "lucide-react"
import type { GarageDto } from "@shared/models/GarageDto"
import type { GarageVehicleDto } from "@shared/models/GarageVehicleDto"
import { fetchNui } from "../../utils/fetchNui"

const Garage = () => {
  const [garage, setGarage] = useState<GarageDto | null>({
    name: 'Lade Garage...',
    type: 0,
  })
  const [vehicles, setVehicles] = useState<GarageVehicleDto[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState<"park" | "unpark">("unpark")
  const [sortBy, setSortBy] = useState<"name" | "favorite">("name")

  useEffect(() => {
    const load = async () => {
      const data = await fetchNui(`Garage::Load`);
      console.log(data);
      const garageData = data as GarageDto;
      setGarage(garageData);
    }
    load();
  }, []);

  useEffect(() => {
    const loadVehicles = async () => {
      try {
        const data = JSON.parse(await fetchNui(`Garage::${activeTab === "park" ? "GetNearest" : "GetParkout"}`));
        console.log("Daten von fetchNui:", data);
        if (!Array.isArray(data)) {
          console.error("Unerwartetes Format von fetchNui:", data);
          setVehicles([]);
        } else {
          setVehicles(data);
        }
      } catch (error) {
        console.error("Fehler beim Laden der Fahrzeuge:", error);
        setVehicles([]);
      }
    };
    loadVehicles();
  }, [activeTab]);
  

  const filteredVehicles = vehicles
    .filter((vehicle) => vehicle.name &&  vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "favorite") {
        if (a.isFavorite && !b.isFavorite) return -1
        if (!a.isFavorite && b.isFavorite) return 1
      }
      return a.name.localeCompare(b.name)
    })

  const handlePark = async (vehicleId: number) => {
    const data = JSON.parse(await fetchNui(`Garage::ParkVehicle`, vehicleId));
    if (data.sucess) {
      setVehicles(vehicles.filter((vehicle) => vehicle.id !== vehicleId));
    }
  }

  const handleUnpark = async (vehicleId: number) => {
    const data = JSON.parse(await fetchNui(`Garage::ParkoutVehicle`, vehicleId));
    if (data.success) {
      setVehicles(vehicles.filter((vehicle) => vehicle.id !== vehicleId));
    }
  }

  const toggleFavorite = (vehicleId: number) => {
    setVehicles(
      vehicles.map((vehicle) => (vehicle.id === vehicleId ? { ...vehicle, isFavorite: !vehicle.isFavorite } : vehicle)),
    )
  }

  const close = () => {
    fetchNui(`ServerEvent`, `Garage::Close`)
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="w-full max-w-5xl p-6 bg-zinc-900/90 backdrop-blur-xl rounded-2xl border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Car className="w-5 h-5" />
            {garage.name}
            <span className="text-sm font-normal text-white/50">({vehicles.length} Fahrzeuge)</span>
          </h2>
          <button onClick={close} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
            <X className="w-5 h-5 text-white/70" />
          </button>
        </div>

        <div className="flex gap-4 mb-4">
          {/* Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("unpark")}
              className={`py-2 px-6 rounded-lg text-sm font-medium transition-colors
                ${activeTab === "unpark" ? "bg-red-600 text-white" : "bg-black/40 text-white/70 hover:bg-black/60"}`}
            >
              Ausparken
            </button>
            <button
              onClick={() => setActiveTab("park")}
              className={`py-2 px-6 rounded-lg text-sm font-medium transition-colors
                ${activeTab === "park" ? "bg-red-600 text-white" : "bg-black/40 text-white/70 hover:bg-black/60"}`}
            >
              Einparken
            </button>
          </div>

          {/* Sort & Search */}
          <div className="flex gap-2 flex-1 justify-end">
            <button
              onClick={() => setSortBy(sortBy === "name" ? "favorite" : "name")}
              className="p-2 bg-black/40 rounded-lg text-white/70 hover:bg-black/60 transition-colors"
            >
              <Star className="w-5 h-5" fill={sortBy === "favorite" ? "currentColor" : "none"} />
            </button>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                placeholder="Fahrzeug suchen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/20"
              />
            </div>
          </div>
        </div>

        {/* Vehicle List */}
        <div className="grid grid-cols-3 gap-2 max-h-[calc(100vh-280px)] overflow-y-auto scrollbar-none">
          {filteredVehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="flex items-center gap-4 p-3 bg-black/40 rounded-lg border border-white/5 hover:bg-black/60 transition-colors group"
            >
              <div className="w-12 h-12 bg-black/40 rounded-lg flex items-center justify-center">
                <Car className="w-6 h-6 text-white/70" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-white font-medium truncate">{vehicle.name}</h3>
                  {vehicle.isFavorite && <Star className="w-4 h-4 text-yellow-500 flex-shrink-0" />}
                </div>
                <p className="text-sm text-white/60 truncate">{vehicle.note}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleFavorite(vehicle.id)}
                  className="p-2 text-white/40 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:text-yellow-500 hover:bg-yellow-500/10"
                >
                  <Star className="w-5 h-5" fill={vehicle.isFavorite ? "currentColor" : "none"} />
                </button>
                <button
                  onClick={() => (activeTab === "park" ? handlePark(vehicle.id) : handleUnpark(vehicle.id))}
                  className="p-2 bg-red-600/10 text-red-600 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 hover:text-white"
                >
                  <ParkingSquare className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}

          {filteredVehicles.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center gap-2 p-8 text-white/60">
              <AlertCircle className="w-8 h-8" />
              <p>Keine Fahrzeuge gefunden</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Garage