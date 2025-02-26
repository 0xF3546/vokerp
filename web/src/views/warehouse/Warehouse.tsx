import { useState } from "react"
import { Warehouse, DoorOpen, DoorClosed, ArrowUpCircle, X, DollarSign } from "lucide-react"
import { WarehouseDto } from "@shared/models/WarehouseDto"

export default function WarehouseManagement() {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [selectedWarehouse, setSelectedWarehouse] = useState<WarehouseDto>({
    id: 1,
    street: "Grove Street",
    number: 42,
    level: 2,
    price: 250000,
    isDoorOpen: false,
    isInside: false,
    upgradePrice: 75000,
    isOwner: true
  })

  const toggleDoor = () => {
    setSelectedWarehouse((prev) => ({ ...prev, isDoorOpen: !prev.isDoorOpen }))
  }

  const enterWarehouse = () => {
    setSelectedWarehouse((prev) => ({ ...prev, isInside: true }))
  }

  const leaveWarehouse = () => {
    setSelectedWarehouse((prev) => ({ ...prev, isInside: false }))
  }

  const handleUpgrade = () => {
    // Hier würde die Logik für das Upgrade implementiert werden
    setShowUpgradeModal(false)
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-2xl bg-zinc-900/90 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Warehouse className="w-5 h-5" />
              Lagerhalle #{selectedWarehouse.number}
            </h2>
            <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
              <X className="w-5 h-5 text-white/70" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-black/40 rounded-xl p-4 border border-white/5">
              <div className="text-white/50 text-sm mb-1">Straße</div>
              <div className="text-lg font-semibold text-white">{selectedWarehouse.street}</div>
            </div>
            <div className="bg-black/40 rounded-xl p-4 border border-white/5">
              <div className="text-white/50 text-sm mb-1">Nummer</div>
              <div className="text-lg font-semibold text-white">#{selectedWarehouse.number}</div>
            </div>
            <div className="bg-black/40 rounded-xl p-4 border border-white/5">
              <div className="text-white/50 text-sm mb-1">Level</div>
              <div className="text-lg font-semibold text-white">{selectedWarehouse.level}</div>
            </div>
            <div className="bg-black/40 rounded-xl p-4 border border-white/5">
              <div className="text-white/50 text-sm mb-1">Preis</div>
              <div className="text-lg font-semibold text-white">${selectedWarehouse.price.toLocaleString()}</div>
            </div>
          </div>

          {/* Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={toggleDoor}
              className={`p-6 rounded-xl border border-white/5 flex items-center justify-between transition-colors ${
                selectedWarehouse.isDoorOpen
                  ? "bg-red-600/20 text-white"
                  : "bg-black/40 text-white/70 hover:bg-black/60"
              }`}
            >
              <div className="flex items-center gap-3">
                {selectedWarehouse.isDoorOpen ? <DoorOpen className="w-5 h-5" /> : <DoorClosed className="w-5 h-5" />}
                <span>{selectedWarehouse.isDoorOpen ? "Tür schließen" : "Tür öffnen"}</span>
              </div>
              <div className={`w-2 h-2 rounded-full ${selectedWarehouse.isDoorOpen ? "bg-red-500" : "bg-white/20"}`} />
            </button>

            {selectedWarehouse.isDoorOpen && !selectedWarehouse.isInside && (
              <button
                onClick={enterWarehouse}
                className="p-6 rounded-xl border border-white/5 bg-black/40 text-white/70 hover:bg-black/60 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Warehouse className="w-5 h-5" />
                  <span>Lagerhalle betreten</span>
                </div>
              </button>
            )}

            {selectedWarehouse.isInside && (
              <button
                onClick={leaveWarehouse}
                className="p-6 rounded-xl border border-white/5 bg-black/40 text-white/70 hover:bg-black/60 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Warehouse className="w-5 h-5" />
                  <span>Lagerhalle verlassen</span>
                </div>
              </button>
            )}

            <button
              onClick={() => setShowUpgradeModal(true)}
              className="p-6 rounded-xl border border-white/5 bg-black/40 text-white/70 hover:bg-black/60 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <ArrowUpCircle className="w-5 h-5" />
                <span>Lagerhalle upgraden</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="w-full max-w-md p-6 bg-zinc-900/90 backdrop-blur-xl rounded-2xl border border-white/10 m-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <ArrowUpCircle className="w-5 h-5" />
                Lagerhalle upgraden
              </h3>
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white/70" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-black/40 rounded-lg border border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/70">Aktuelles Level</span>
                  <span className="text-white font-medium">{selectedWarehouse.level}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Nächstes Level</span>
                  <span className="text-white font-medium">{selectedWarehouse.level + 1}</span>
                </div>
              </div>

              <div className="p-4 bg-black/40 rounded-lg border border-white/5">
                <div className="flex items-center gap-2 text-white/70 mb-2">
                  <DollarSign className="w-4 h-4" />
                  <span>Upgrade Kosten</span>
                </div>
                <div className="text-2xl font-semibold text-white">
                  ${selectedWarehouse.upgradePrice.toLocaleString()}
                </div>
              </div>

              <button
                onClick={handleUpgrade}
                className="w-full py-3 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors font-medium"
              >
                Upgrade durchführen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}