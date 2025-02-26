import { useEffect, useState } from "react"
import { Car, Search, X, AlertCircle } from "lucide-react"
import { VehicleShopDto } from "@shared/models/VehicleShopDto"
import { VehicleShopVehicleDto } from "@shared/models/VehicleShopVehicleDto"
import { fetchNui } from "web/src/utils/fetchNui"

interface PurchaseConfirmation {
  vehicle: VehicleShopVehicleDto
  isOpen: boolean
}

export default function VehicleShop() {
  const [searchQuery, setSearchQuery] = useState("")
  const [vehicleShop, setVehicleShop] = useState<VehicleShopDto>(null)
  const [purchaseConfirmation, setPurchaseConfirmation] = useState<PurchaseConfirmation>({
    vehicle: null!,
    isOpen: false,
  })

  useEffect(() => {
    const load = async () => {
        const data: VehicleShopDto = await fetchNui("VehicleShop::Load");
        setVehicleShop(data);
    }
    load();
  }, [])

  const filteredVehicles = vehicleShop.vehicles.filter((vehicle) => vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const handlePurchase = (vehicle: VehicleShopVehicleDto) => {
    setPurchaseConfirmation({ vehicle, isOpen: true })
  }

  const confirmPurchase = async () => {
    const data = await fetchNui("VehicleShop::Purchase", purchaseConfirmation.vehicle.id);
    if (data) {
        setPurchaseConfirmation({ vehicle: null!, isOpen: false });
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-black/50">
      <div className="w-full max-w-7xl p-6 bg-zinc-900/90 backdrop-blur-xl rounded-2xl border border-white/10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Car className="w-5 h-5" />
            Premium Motorsport
            <span className="text-sm font-normal text-white/50">({filteredVehicles.length} Fahrzeuge)</span>
          </h2>
          <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
            <X className="w-5 h-5 text-white/70" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Fahrzeug suchen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/20"
            />
          </div>
        </div>

        {/* Vehicle Grid */}
        <div className="max-h-[calc(100vh-280px)] overflow-y-auto pr-2">
          {filteredVehicles.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 p-8 text-white/60">
              <Car className="w-8 h-8" />
              <p>Keine Fahrzeuge gefunden</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {filteredVehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="bg-black/40 rounded-lg border border-white/5 hover:bg-black/60 transition-colors group"
                >
                  <div className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-black/40 rounded-lg flex items-center justify-center">
                        <Car className="w-5 h-5 text-white/70" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-medium truncate">{vehicle.name}</h3>
                        <p className="text-red-500 font-medium text-sm">{formatPrice(vehicle.price)}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handlePurchase(vehicle)}
                      className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
                    >
                      Kaufen
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Purchase Confirmation Modal */}
        {purchaseConfirmation.isOpen && (
          <div className="fixed inset-0 flex items-center justify-center p-4 bg-black/80">
            <div className="w-full max-w-md p-6 bg-zinc-900 rounded-2xl border border-white/10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white">Kauf bestätigen</h3>
                  <p className="text-sm text-white/70">Bist du sicher, dass du dieses Fahrzeug kaufen möchtest?</p>
                </div>
              </div>

              <div className="bg-black/40 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/70">Fahrzeug</span>
                  <span className="text-white font-medium">{purchaseConfirmation.vehicle.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Preis</span>
                  <span className="text-red-500 font-medium">{formatPrice(purchaseConfirmation.vehicle.price)}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setPurchaseConfirmation({ vehicle: null!, isOpen: false })}
                  className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors text-sm font-medium"
                >
                  Abbrechen
                </button>
                <button
                  onClick={confirmPurchase}
                  className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
                >
                  Kaufen
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}