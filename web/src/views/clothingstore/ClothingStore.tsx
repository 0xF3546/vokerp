"use client"

import { useState } from "react"
import {
  ChevronLeft,
  ShoppingCart,
  Shirt,
  PenIcon as Pants,
  FootprintsIcon as Shoes,
  Watch,
  HardHatIcon as Hat,
  Glasses,
  X,
  ChevronRight,
} from "lucide-react"

// Basis-Interface für gemeinsame Eigenschaften
interface BaseItem {
  id: string | number
  label: string
}

// Interface für Navigations-Kategorien
interface CategoryItem extends BaseItem {
  type: "category"
  icon?: any
}

// Interface für Kleidungsstücke
interface ClothingItem extends BaseItem {
  type: "clothing"
  name: string
  price: number
  category: string
  subCategory: string
  componentId: number
  drawableId: number
  textureId: number
  owned: boolean
}

// Interface für Warenkorb-Items
interface CartItem extends ClothingItem {
  quantity: number
}

type NavigationItem = CategoryItem | ClothingItem

export default function ClothingStore() {
  const [navigationStack, setNavigationStack] = useState<string[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [showCart, setShowCart] = useState(false)
  const [heading, setHeading] = useState<number>(0)

  const categories: { [key: string]: NavigationItem[] } = {
    root: [
      { id: "shirts", type: "category", label: "Oberteile", icon: Shirt },
      { id: "pants", type: "category", label: "Hosen", icon: Pants },
      { id: "shoes", type: "category", label: "Schuhe", icon: Shoes },
      { id: "accessories", type: "category", label: "Accessoires", icon: Watch },
      { id: "hats", type: "category", label: "Kopfbedeckungen", icon: Hat },
      { id: "glasses", type: "category", label: "Brillen", icon: Glasses },
    ],
    shirts: [
      { id: "tshirts", type: "category", label: "T-Shirts" },
      { id: "shirts", type: "category", label: "Hemden" },
      { id: "jackets", type: "category", label: "Jacken" },
      { id: "sweaters", type: "category", label: "Pullover" },
    ],
    tshirts: [
      {
        id: 1,
        type: "clothing",
        label: "Basic T-Shirt",
        name: "Basic T-Shirt",
        price: 25,
        category: "shirts",
        subCategory: "tshirts",
        componentId: 11,
        drawableId: 0,
        textureId: 0,
        owned: false,
      },
      {
        id: 2,
        type: "clothing",
        label: "Premium T-Shirt",
        name: "Premium T-Shirt",
        price: 45,
        category: "shirts",
        subCategory: "tshirts",
        componentId: 11,
        drawableId: 1,
        textureId: 0,
        owned: false,
      },
    ],
  }

  const navigate = (categoryId: string) => {
    setNavigationStack([...navigationStack, categoryId])
  }

  const navigateBack = () => {
    setNavigationStack(navigationStack.slice(0, -1))
  }

  const getCurrentItems = () => {
    const currentLevel = navigationStack.length > 0 ? navigationStack[navigationStack.length - 1] : "root"
    return categories[currentLevel] || []
  }

  const getBreadcrumbs = () => {
    return navigationStack.map((id) => {
      const findLabel = (items: NavigationItem[]) => {
        for (const item of items) {
          if (item.id === id) return item.label
        }
        return id
      }
      return findLabel(Object.values(categories).flat())
    })
  }

  const addToCart = (item: ClothingItem) => {
    if (!cart.some((cartItem) => cartItem.id === item.id)) {
      setCart([...cart, { ...item, quantity: 1 }])
    }
  }

  const removeFromCart = (itemId: number) => {
    setCart(cart.filter((item) => item.id !== itemId))
  }

  const tryOn = (item: ClothingItem) => {
    // Hier NUI Event zum Anprobieren
  }

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price, 0)
  }

  const handleCancel = () => {
    // Hier NUI Event zum Schließen
    // fetchNui("ClothingStore::Close")
  }

  const currentItems = getCurrentItems()
  const breadcrumbs = getBreadcrumbs()

  const isClothingItem = (item: NavigationItem): item is ClothingItem => {
    return item.type === "clothing"
  }

  const isCategoryItem = (item: NavigationItem): item is CategoryItem => {
    return item.type === "category"
  }

  return (
    <div className="fixed inset-0 flex items-stretch bg-black/40 backdrop-blur-sm">
      {/* Linke Sidebar - Navigation */}
      <div className="w-80 bg-neutral-900 border-r border-red-500/20">
        {/* Header */}
        <div className="h-12 flex items-center px-4 border-b border-red-500/20">
          <div className="flex items-center gap-2 flex-1">
            {navigationStack.length > 0 && (
              <button
                onClick={navigateBack}
                className="w-6 h-6 flex items-center justify-center rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            )}
            <div className="flex-1 truncate">
              <h2 className="text-sm font-bold text-white truncate">
                {breadcrumbs.length > 0 ? breadcrumbs[breadcrumbs.length - 1] : "Kategorien"}
              </h2>
              {breadcrumbs.length > 0 && (
                <div className="text-xs text-neutral-500 truncate">{breadcrumbs.slice(0, -1).join(" / ")}</div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="p-4 space-y-1.5">
          {currentItems.map((item) => {
            if (isClothingItem(item)) {
              return (
                <div
                  key={item.id}
                  className="group relative overflow-hidden rounded-lg bg-neutral-800/50 hover:bg-neutral-800 transition-all"
                >
                  <div onClick={() => tryOn(item)} className="w-full p-3 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-sm text-white group-hover:text-red-500 transition-colors">
                        {item.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-neutral-400">${item.price}</span>
                        {!item.owned && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              addToCart(item)
                            }}
                            disabled={cart.some((cartItem) => cartItem.id === item.id)}
                            className="w-6 h-6 rounded-lg bg-neutral-700 hover:bg-neutral-600 disabled:opacity-50 disabled:hover:bg-neutral-700 flex items-center justify-center transition-colors"
                          >
                            <ShoppingCart className="w-3 h-3 text-white" />
                          </button>
                        )}
                        {item.owned && <div className="w-2 h-2 rounded-full bg-green-500" />}
                      </div>
                    </div>
                  </div>
                </div>
              )
            }

            if (isCategoryItem(item)) {
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(String(item.id))}
                  className="group w-full p-3 rounded-lg bg-neutral-800/50 hover:bg-neutral-800 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {item.icon && (
                        <div className="w-6 h-6 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                          <item.icon className="w-3 h-3" />
                        </div>
                      )}
                      <span className="text-sm font-medium text-white group-hover:text-red-500 transition-colors">
                        {item.label}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-neutral-600 group-hover:text-red-500 transition-colors" />
                  </div>
                </button>
              )
            }

            return null
          })}
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 bg-neutral-900/80 border-t border-red-500/10">
          <div className="px-4 py-3 flex flex-col items-center gap-3">
            <div className="w-72">
              <input
                type="range"
                min="0"
                max="100"
                value={heading}
                onChange={(e) => setHeading(Number(e.target.value))}
                className="w-full appearance-none bg-transparent 
        [&::-webkit-slider-runnable-track]:h-2 
        [&::-webkit-slider-runnable-track]:rounded-full 
        [&::-webkit-slider-runnable-track]:bg-neutral-800 
        [&::-webkit-slider-thumb]:mt-[-6px] 
        [&::-webkit-slider-thumb]:h-5 
        [&::-webkit-slider-thumb]:w-5 
        [&::-webkit-slider-thumb]:appearance-none 
        [&::-webkit-slider-thumb]:rounded-full 
        [&::-webkit-slider-thumb]:bg-red-500 
        [&::-webkit-slider-thumb]:border-4 
        [&::-webkit-slider-thumb]:border-neutral-900
        [&::-webkit-slider-thumb]:shadow-lg
        hover:[&::-webkit-slider-thumb]:bg-red-400
        active:[&::-webkit-slider-thumb]:scale-110
        transition-all"
              />
            </div>
            <button
              onClick={handleCancel}
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white text-xs transition-colors"
            >
              <X className="w-3 h-3" />
              Abbrechen
            </button>
          </div>
        </div>
      </div>

      {/* Mittlerer Bereich - Charakter */}
      <div className="flex-1 flex flex-col items-center justify-center">{/* Leerer Bereich für den Charakter */}</div>

      {/* Rechte Sidebar - Warenkorb */}
      <div className="w-72 bg-neutral-900 border-l border-red-500/20">
        <div className="h-12 flex items-center justify-between px-4 border-b border-red-500/20">
          <h2 className="text-sm font-bold text-white">Warenkorb</h2>
          <span className="text-xs text-neutral-500">{cart.length} Artikel</span>
        </div>

        <div className="p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="w-8 h-8 mx-auto text-neutral-700 mb-3" />
              <p className="text-xs text-neutral-500">Dein Warenkorb ist leer</p>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-neutral-800/50">
                    <div>
                      <h3 className="text-sm font-medium text-white">{item.name}</h3>
                      <p className="text-xs text-neutral-400">${item.price}</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(Number(item.id))}
                      className="w-6 h-6 rounded-lg bg-neutral-700 hover:bg-neutral-600 flex items-center justify-center transition-colors"
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-neutral-800">
                <div className="flex justify-between mb-4">
                  <span className="text-sm text-neutral-400">Gesamt</span>
                  <span className="text-sm font-bold text-white">${calculateTotal()}</span>
                </div>
                <button className="w-full py-2 rounded bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors">
                  Kaufen
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

