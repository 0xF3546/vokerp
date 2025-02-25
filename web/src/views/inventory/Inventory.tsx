import type React from "react"

import { useState, useEffect, useRef } from "react"
import { DndProvider, useDrag, useDrop } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import {
  Trash2,
  Share,
  HandMetal,
  Scale,
  Package,
  ChevronRight,
  User,
  Smartphone,
  Tablet,
  FileText,
  PenIcon as Gun,
  X,
  BadgeIcon as Bullet,
} from "lucide-react"

// Add fetchNui import
import { fetchNui } from "../../utils/fetchNui"
import { InventoryDto } from "@shared/models/InventoryDto"
import { InventoryItemDto } from "@shared/models/InventoryItemDto"

// Erweiterte Types
interface WeaponItem {
  id: number
  name: string
  ammo: number
  image: string
}

// Types remain the same
interface DragItem {
  type: string
  item: InventoryItemDto
  sourceSlot: number
  sourceInventory: string
}

const InventorySlot = ({
  item,
  slot,
  inventoryName,
  onDrop,
  onRightClick,
}: {
  item: InventoryItemDto | undefined
  slot: number
  inventoryName: string
  onDrop: (item: DragItem, targetSlot: number, targetInventory: string) => void
  onRightClick: (item: InventoryItemDto, event: React.MouseEvent) => void
}) => {
  const [{ isOver }, drop] = useDrop({
    accept: "ITEM",
    drop: (draggedItem: DragItem) => {
      onDrop(draggedItem, slot, inventoryName)
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  })

  return (
    <div
      ref={drop}
      className={`w-[3.75rem] h-[3.75rem] flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-lg 
        border border-white/[0.05] hover:border-white/20 transition-all duration-200
        ${isOver ? "border-white/30 bg-white/10" : ""}`}
      onContextMenu={(e) => item && onRightClick(item, e)}
    >
      {item && <InventoryColumn inventoryItemDto={item} />}
    </div>
  )
}

const InventoryColumn = ({ inventoryItemDto }: { inventoryItemDto: InventoryItemDto }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "ITEM",
    item: { type: "ITEM", item: inventoryItemDto },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  return (
    <div
      ref={drag}
      className={`relative flex flex-col items-center w-full h-full p-1.5 rounded-lg 
        hover:bg-white/5 transition-all duration-200 cursor-grab active:cursor-grabbing
        ${isDragging ? "opacity-50" : "opacity-100"}`}
    >
      <img
        src={inventoryItemDto.item.imagePath || "/placeholder.svg"}
        alt={inventoryItemDto.item.displayName}
        className="w-8 h-8 object-contain rounded-md"
      />
      <span className="absolute bottom-0.5 right-0.5 text-xs font-medium bg-black/80 px-1 py-0.5 rounded-md border border-white/10">
        {inventoryItemDto.amount}
      </span>
    </div>
  )
}

const WeaponsMenu = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) => {
  const weapons: WeaponItem[] = [
    {
      id: 1,
      name: "Combat Pistol",
      ammo: 24,
      image: "https://wiki.rage.mp/images/1/16/Combat-pistol-icon.png",
    },
    {
      id: 2,
      name: "Carbine Rifle",
      ammo: 120,
      image: "https://wiki.rage.mp/images/8/8b/Carbinerifle-icon.png",
    },
    {
      id: 3,
      name: "Heavy Sniper",
      ammo: 12,
      image: "https://wiki.rage.mp/images/c/c8/Heavy-sniper-icon.png",
    },
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50">
      <div className="bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-white flex items-center gap-2">
            <Gun className="w-5 h-5" />
            Waffen
          </h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/5 transition-colors">
            <X className="w-5 h-5 text-white/70" />
          </button>
        </div>

        <div className="space-y-3">
          {weapons.map((weapon) => (
            <button
              key={weapon.id}
              className="w-full flex items-center gap-4 p-3 bg-black/40 rounded-xl hover:bg-black/60 transition-colors border border-white/5"
            >
              <img src={weapon.image || "/placeholder.svg"} alt={weapon.name} className="w-12 h-12 object-contain" />
              <div className="flex-1 text-left">
                <div className="text-white font-medium">{weapon.name}</div>
                <div className="flex items-center gap-1 text-white/60 text-sm">
                  <Bullet className="w-4 h-4" />
                  {weapon.ammo}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

const QuickAccessButton = ({
  icon: Icon,
  label,
  onClick,
}: {
  icon: React.ElementType
  label: string
  onClick?: () => void
}) => (
  <button
    onClick={onClick}
    className="p-2 bg-black/40 rounded-lg hover:bg-black/60 transition-colors border border-white/5"
    title={label}
  >
    <Icon className="w-5 h-5 text-white/70" />
  </button>
)

const Inventory = () => {
  const [inventory, setInventory] = useState<InventoryDto>({
    name: "Inventar",
    maxSlots: 14,
    maxWeight: 25,
    items: [
      {
        slot: 0,
        item: {
          name: "Test Item",
          weight: 1,
          displayName: "Test Item",
          id: 0,
          imagePath: "/placeholder.svg?height=150&width=150",
          maxStack: 1,
        },
        amount: 1,
        id: 0,
      },
    ],
  })

  const [addonInventory, setAddonInventory] = useState<InventoryDto | null>({
    name: "Frakationslager Steve",
    maxSlots: 14,
    maxWeight: 25,
    items: [
      {
        slot: 0,
        item: {
          name: "Test Item",
          weight: 1,
          displayName: "Test Item",
          id: 0,
          imagePath: "/placeholder.svg?height=150&width=150",
          maxStack: 1,
        },
        amount: 1,
        id: 0,
      },
    ],
  })
  const [contextMenu, setContextMenu] = useState<{ item: InventoryItemDto; x: number; y: number } | null>(null)
  const [amountToDiscard, setAmountToDiscard] = useState<number>(1)
  const [isWeaponsMenuOpen, setIsWeaponsMenuOpen] = useState(false)
  const contextMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Initial inventory load
    fetchNui("Inventory::Get").then((data) => {
      console.log(data)
      setInventory(data as InventoryDto)
    })

    const handleClickOutside = (event: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
        setContextMenu(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const getWeight = (inv: InventoryDto) => {
    return inv.items.reduce((acc, item) => acc + item.item.weight * item.amount, 0)
  }

  const getItemAtSlot = (slot: number, inv: InventoryDto) => {
    return inv.items.find((item) => item.slot === slot)
  }

  const handleRightClick = (item: InventoryItemDto, event: React.MouseEvent) => {
    event.preventDefault()
    setContextMenu({ item, x: event.clientX, y: event.clientY })
  }

  const handleDrop = (draggedItem: DragItem, targetSlot: number, targetInventory: string) => {
    console.log(
      `Item verschoben von Slot ${draggedItem.sourceSlot} (${draggedItem.sourceInventory}) zu Slot ${targetSlot} (${targetInventory})`,
    )

    // Send event to server
    fetchNui("Inventory::MoveItem", {
      itemId: draggedItem.item.id,
      fromSlot: draggedItem.sourceSlot,
      fromInventory: draggedItem.sourceInventory,
      toSlot: targetSlot,
      toInventory: targetInventory,
    }).then((response: any) => {
      if (response.success) {
        // Update inventories based on movement type
        if (draggedItem.sourceInventory === "main" && targetInventory === "main") {
          // Move item within main inventory
          setInventory((prev) => {
            const newItems = prev.items.filter((item) => item.slot !== draggedItem.sourceSlot)
            newItems.push({ ...draggedItem.item, slot: targetSlot })
            return { ...prev, items: newItems }
          })
        } else if (draggedItem.sourceInventory === "main" && targetInventory === "addon") {
          // Move item from main to addon inventory
          setInventory((prev) => ({
            ...prev,
            items: prev.items.filter((item) => item.slot !== draggedItem.sourceSlot),
          }))
          setAddonInventory((prev) => {
            if (!prev) return prev
            const newItems = prev.items.filter((item) => item.slot !== targetSlot)
            newItems.push({ ...draggedItem.item, slot: targetSlot })
            return { ...prev, items: newItems }
          })
        } else if (draggedItem.sourceInventory === "addon" && targetInventory === "main") {
          // Move item from addon to main inventory
          setAddonInventory((prev) => {
            if (!prev) return prev
            return {
              ...prev,
              items: prev.items.filter((item) => item.slot !== draggedItem.sourceSlot),
            }
          })
          setInventory((prev) => {
            const newItems = prev.items.filter((item) => item.slot !== targetSlot)
            newItems.push({ ...draggedItem.item, slot: targetSlot })
            return { ...prev, items: newItems }
          })
        } else if (draggedItem.sourceInventory === "addon" && targetInventory === "addon") {
          // Move item within addon inventory
          setAddonInventory((prev) => {
            if (!prev) return prev
            const newItems = prev.items.filter((item) => item.slot !== draggedItem.sourceSlot)
            newItems.push({ ...draggedItem.item, slot: targetSlot })
            return { ...prev, items: newItems }
          })
        }
      } else {
        console.error("Fehler beim Verschieben des Items:", response.error)
      }
    })
  }

  const handleDiscard = () => {
    if (contextMenu) {
      fetchNui("Inventory::DiscardItem", {
        itemId: contextMenu.item.id,
        amount: amountToDiscard,
      }).then((response: any) => {
        if (response.success) {
          setContextMenu(null)
          // Optionally update inventory state here if needed
        }
      })
    }
  }

  const handleUse = () => {
    if (contextMenu) {
      fetchNui("Inventory::UseItem", {
        itemId: contextMenu.item.id,
      }).then((response: any) => {
        if (response.success) {
          setContextMenu(null)
          // Optionally update inventory state here if needed
        }
      })
    }
  }

  const handleSplit = () => {
    if (contextMenu) {
      fetchNui("Inventory::SplitItem", {
        itemId: contextMenu.item.id,
        amount: amountToDiscard,
      }).then((response: any) => {
        if (response.success) {
          setContextMenu(null)
          // Optionally update inventory state here if needed
        }
      })
    }
  }

  // Update context menu buttons to use new handlers
  const contextMenuButtons = [
    {
      icon: HandMetal,
      label: "Benutzen",
      onClick: handleUse,
      className: "text-white/90",
    },
    {
      icon: Share,
      label: "Teilen",
      onClick: handleSplit,
      className: "text-white/90",
    },
    {
      icon: Trash2,
      label: "Wegwerfen",
      onClick: handleDiscard,
      className: "text-red-400",
    },
  ]

  const renderInventory = (inv: InventoryDto, inventoryName: string) => {
    return Array.from({ length: inv.maxSlots }).map((_, slot) => {
      const item = getItemAtSlot(slot, inv)
      return (
        <InventorySlot
          key={slot}
          item={item}
          slot={slot}
          inventoryName={inventoryName}
          onDrop={handleDrop}
          onRightClick={handleRightClick}
        />
      )
    })
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="max-w-[90%] max-h-[90vh] flex gap-12 p-8 bg-zinc-900/90 backdrop-blur-xl rounded-2xl border border-white/10">
          {/* Main Inventory */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3 bg-black/50 rounded-xl p-3">
              <User className="w-5 h-5 text-white/70" />
              <div>
                <h2 className="text-lg font-medium text-white">{inventory.name}</h2>
                <div className="flex items-center gap-2 text-sm text-white/60 mt-0.5">
                  <Scale className="w-4 h-4" />
                  <div className="flex gap-1">
                    <span>{getWeight(inventory)}</span>
                    <span>/</span>
                    <span>{inventory.maxWeight}kg</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Access Buttons */}
            <div className="flex gap-3">
              <QuickAccessButton icon={Smartphone} label="Handy" />
              <QuickAccessButton icon={Tablet} label="Tablet" />
              <QuickAccessButton icon={FileText} label="Lizenzen" />
              <QuickAccessButton icon={Gun} label="Waffen" onClick={() => setIsWeaponsMenuOpen(true)} />
            </div>

            <div className="grid grid-cols-7 gap-3 p-3 bg-black/50 rounded-xl">
              {renderInventory(inventory, "main")}
            </div>
          </div>

          {/* Addon Inventory - Only shown when available */}
          {addonInventory && (
            <>
              <div className="w-px h-full bg-white/10" />
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3 bg-black/50 rounded-xl p-3">
                  <Package className="w-5 h-5 text-white/70" />
                  <div>
                    <h2 className="text-lg font-medium text-white">{addonInventory.name}</h2>
                    <div className="flex items-center gap-2 text-sm text-white/60 mt-0.5">
                      <Scale className="w-4 h-4" />
                      <div className="flex gap-1">
                        <span>{getWeight(addonInventory)}</span>
                        <span>/</span>
                        <span>{addonInventory.maxWeight}kg</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-3 p-3 bg-black/50 rounded-xl">
                  {renderInventory(addonInventory, "addon")}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Weapons Menu */}
        <WeaponsMenu isOpen={isWeaponsMenuOpen} onClose={() => setIsWeaponsMenuOpen(false)} />

        {/* Context Menu */}
        {contextMenu && (
          <div
            ref={contextMenuRef}
            className="absolute z-50 w-48 bg-zinc-900/95 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden"
            style={{ top: contextMenu.y, left: contextMenu.x }}
          >
            {contextMenuButtons.map((button, index) => (
              <button
                key={index}
                onClick={button.onClick}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm ${button.className} hover:bg-white/5 transition-colors`}
              >
                <button.icon className="w-4 h-4" />
                <span>{button.label}</span>
                <ChevronRight className="w-4 h-4 ml-auto opacity-50" />
              </button>
            ))}

            <div className="p-3 border-t border-white/10">
              <input
                type="number"
                value={amountToDiscard}
                onChange={(e) => setAmountToDiscard(Number(e.target.value))}
                min={1}
                max={contextMenu.item.amount}
                className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg 
                  text-white text-sm text-center focus:outline-none focus:border-white/30"
              />
            </div>
          </div>
        )}
      </div>
    </DndProvider>
  )
}

export default Inventory

