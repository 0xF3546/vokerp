import { useState } from "react"
import {
  Home,
  Users,
  DoorOpen,
  DoorClosed,
  Warehouse,
  Car,
  UserPlus,
  X,
  Trash2,
  DollarSign,
  AlertCircle,
} from "lucide-react"
import { HouseDto } from "@shared/models/HouseDto"
import { TenantDto } from "@shared/models/TenantDto"
import { fetchNui } from "web/src/utils/fetchNui"

export default function HouseManagement() {
  const [showTenantsModal, setShowTenantsModal] = useState(false)
  const [newTenantName, setNewTenantName] = useState("")
  const [selectedHouse, setSelectedHouse] = useState<HouseDto>({
    id: 1,
    price: 1250000,
    isDoorOpen: false,
    hasBasement: true,
    hasGarage: true,
    maxTenants: 4,
    isOwner: true,
    isTenant: false,
    isInside: false,
    tenants: [
      { id: 1, name: "John Doe", rent: 2500 },
      { id: 2, name: "Jane Smith", rent: 2500 },
    ],
  })

  const toggleDoor = () => {
    setSelectedHouse((prev) => ({ ...prev, isDoorOpen: !prev.isDoorOpen }))
    fetchNui(`House::${selectedHouse.isDoorOpen ? "Lock" : "Open"}`, selectedHouse.id)
  }

  const addTenant = () => {
    if (!newTenantName || selectedHouse.tenants.length >= selectedHouse.maxTenants) return

    const newTenant: TenantDto = {
      id: selectedHouse.tenants.length + 1,
      name: newTenantName,
      rent: 2500,
    }

    setSelectedHouse((prev) => ({
      ...prev,
      tenants: [...prev.tenants, newTenant],
    }))
    setNewTenantName("")
  }

  const removeTenant = (tenantId: number) => {
    setSelectedHouse((prev) => ({
      ...prev,
      tenants: prev.tenants.filter((tenant) => tenant.id !== tenantId),
    }))
  }

  const updateRent = (tenantId: number, newRent: number) => {
    setSelectedHouse((prev) => ({
      ...prev,
      tenants: prev.tenants.map((tenant) => (tenant.id === tenantId ? { ...tenant, rent: newRent } : tenant)),
    }))
  }

  const openGarage = () => {
    console.log("Opening garage...")
  }

  const close = () => {
    fetchNui("House::Close")
  }

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black/50">
        <div className="w-full max-w-4xl p-6 bg-zinc-900/90 backdrop-blur-xl rounded-2xl border border-white/10 m-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Home className="w-5 h-5" />
                {selectedHouse.id}
              </h2>
              <p className="text-white/50 text-sm mt-1">Hauspreis: ${selectedHouse.price.toLocaleString()}</p>
            </div>
            <button onClick={close} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
              <X className="w-5 h-5 text-white/70" />
            </button>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Quick Stats */}
            <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-black/40 rounded-xl p-4 border border-white/5">
                <div className="text-white/50 text-sm mb-1">Mieter</div>
                <div className="text-2xl font-semibold text-white">
                  {selectedHouse.tenants.length}/{selectedHouse.maxTenants}
                </div>
              </div>
              <div className="bg-black/40 rounded-xl p-4 border border-white/5">
                <div className="text-white/50 text-sm mb-1">Straße</div>
                <div className="text-2xl font-semibold text-white">{selectedHouse.id}</div>
              </div>
              <div className="bg-black/40 rounded-xl p-4 border border-white/5 md:col-span-1 col-span-2">
                <button
                  onClick={() => setShowTenantsModal(true)}
                  className="w-full h-full flex items-center justify-center gap-2 text-white/70 hover:text-white transition-colors"
                >
                  <Users className="w-5 h-5" />
                  <span>Mieterverwaltung öffnen</span>
                </button>
              </div>
            </div>

            {/* Controls */}
            <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(selectedHouse.isOwner || selectedHouse.isTenant) && (
                <button
                  onClick={toggleDoor}
                  className={`p-6 rounded-xl border border-white/5 flex items-center justify-between transition-colors ${selectedHouse.isDoorOpen ? "bg-red-600/20 text-white" : "bg-black/40 text-white/70 hover:bg-black/60"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    {selectedHouse.isDoorOpen ? <DoorOpen className="w-5 h-5" /> : <DoorClosed className="w-5 h-5" />}
                    <span>{selectedHouse.isDoorOpen ? "Tür schließen" : "Tür öffnen"}</span>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${selectedHouse.isDoorOpen ? "bg-red-500" : "bg-white/20"}`} />
                </button>
              )}

              {selectedHouse.isDoorOpen && (
                <button className="p-6 rounded-xl border border-white/5 bg-black/40 text-white/70 hover:bg-black/60 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Home className="w-5 h-5" />
                    <span>Haus {selectedHouse.isInside ? 'verlassen' : 'betreten'}</span>
                  </div>
                </button>
              )}

              {selectedHouse.isDoorOpen && selectedHouse.hasBasement && (
                <button className="p-6 rounded-xl border border-white/5 bg-black/40 text-white/70 hover:bg-black/60 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Warehouse className="w-5 h-5" />
                    <span>Keller betreten</span>
                  </div>
                </button>
              )}

              {selectedHouse.hasGarage && selectedHouse.isOwner && (
                <button
                  onClick={openGarage}
                  className={`p-6 rounded-xl border border-white/5 flex items-center justify-between transition-colors bg-black/40 text-white/70 hover:bg-black/60`}
                >
                  <div className="flex items-center gap-3">
                    <Car className="w-5 h-5" />
                    <span>Garage öffnen</span>
                  </div>
                  <div
                    className={`w-2 h-2 rounded-full bg-white/20`}
                  />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tenants Modal */}
      {showTenantsModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="w-full max-w-2xl p-6 bg-zinc-900/90 backdrop-blur-xl rounded-2xl border border-white/10 m-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <Users className="w-5 h-5" />
                Mieterverwaltung
              </h3>
              <button
                onClick={() => setShowTenantsModal(false)}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white/70" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Add new tenant */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTenantName}
                  onChange={(e) => setNewTenantName(e.target.value)}
                  placeholder="Name des neuen Mieters"
                  className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white placeholder:text-white/40"
                />
                <button
                  onClick={addTenant}
                  disabled={selectedHouse.tenants.length >= selectedHouse.maxTenants}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <UserPlus className="w-5 h-5" />
                  <span className="hidden sm:inline">Hinzufügen</span>
                </button>
              </div>

              {/* Tenant list */}
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                {selectedHouse.tenants.length === 0 ? (
                  <div className="text-center py-8 text-white/50 flex flex-col items-center gap-2">
                    <AlertCircle className="w-8 h-8" />
                    <p>Keine Mieter vorhanden</p>
                  </div>
                ) : (
                  selectedHouse.tenants.map((tenant) => (
                    <div key={tenant.id} className="flex items-center gap-4 bg-black/20 p-4 rounded-lg group">
                      <span className="text-white flex-1">{tenant.name}</span>
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <DollarSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                          <input
                            type="number"
                            value={tenant.rent}
                            onChange={(e) => updateRent(tenant.id, Number.parseInt(e.target.value))}
                            className="w-32 bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white"
                          />
                        </div>
                        <button
                          onClick={() => removeTenant(tenant.id)}
                          className="p-2 text-white/40 hover:text-red-500 hover:bg-red-500/20 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}