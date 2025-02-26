import { useEffect, useState } from "react"
import { Search, ShoppingCart, X, Package, AlertCircle, Plus, Minus, Trash2 } from "lucide-react"
import { ShopItemDto } from "@shared/models/ShopItemDto"
import { CheckoutDto } from "@shared/models/CheckoutDto"
import { fetchNui } from "../../utils/fetchNui"

interface CartItem extends ShopItemDto {
  quantity: number
}

export default function Shop() {
  const [searchQuery, setSearchQuery] = useState("")
  const [cart, setCart] = useState<CartItem[]>([])
  const [shopItems, setShopItems] = useState<ShopItemDto[]>([])

  useEffect(() => {
    fetchNui("Shop::GetItems")
      .then((items: string) => {
        items = JSON.parse(items);
        if (!Array.isArray(items)) {
          console.error("Unerwartetes Format von fetchNui:", items);
          setShopItems([]); // Fallback
        } else {
          setShopItems(items);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch shop items:", error);
        setShopItems([]); // Fallback, falls der API-Call fehlschlägt
      });
  }, []);
  
  const filteredItems = shopItems.filter(
    (item) => item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  

  const addToCart = (item: ShopItemDto) => {
    setCart((currentCart) => {
      const existingItem = currentCart.find((cartItem) => cartItem.id === item.id)
      if (existingItem) {
        return currentCart.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem,
        )
      }
      return [...currentCart, { ...item, quantity: 1 }]
    })
  }

  const updateQuantity = (itemId: number, value: string) => {
    const newQuantity = Number.parseInt(value)
    if (isNaN(newQuantity) || newQuantity < 0) return

    if (newQuantity === 0) {
      removeFromCart(itemId)
      return
    }

    setCart((currentCart) =>
      currentCart.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item)),
    )
  }

  const incrementQuantity = (itemId: number) => {
    setCart((currentCart) =>
      currentCart.map((item) => (item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item)),
    )
  }

  const decrementQuantity = (itemId: number) => {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === itemId && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item,
      ),
    )
  }

  const removeFromCart = (itemId: number) => {
    setCart((currentCart) => currentCart.filter((item) => item.id !== itemId))
  }

  const clearCart = () => {
    setCart([])
  }

  const close = () => {
    clearCart()
    fetchNui("ServerEvent", "Shop::Close");
  }

  const checkout = async () => {
    if (cart.length === 0) return;
    const dtos: CheckoutDto[] = cart.map((item) => ({ itemId: item.id, amount: item.quantity }))

    await fetchNui("ServerEvent", "Shop::Checkout", dtos)
    clearCart()
  }

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="w-full max-w-5xl mx-auto bg-zinc-900/95 backdrop-blur-xl rounded-xl border border-white/10">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-red-500" />
            Shop
          </h2>
          <button onClick={close} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
            <X className="w-5 h-5 text-white/70" />
          </button>
        </div>

        <div className="flex h-[500px]">
          {/* Shop Items Section */}
          <div className="flex-1 p-4 border-r border-white/10">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                placeholder="Suche..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-black/40 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-red-500/50"
              />
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 overflow-y-auto h-[380px] pr-2">
              {filteredItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => addToCart(item)}
                  className="flex flex-col h-[140px] bg-black/40 rounded-lg border border-white/10 hover:border-red-500/50 transition-all"
                >
                  <div className="p-3 h-[80px] flex items-center justify-center">
                    <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-14 h-14 object-contain" />
                  </div>
                  <div className="flex flex-col justify-between p-3 h-[60px] text-left border-t border-white/10">
                    <h3 className="text-xs font-medium text-white leading-tight line-clamp-2">{item.name}</h3>
                    <p className="text-xs font-medium text-red-500">${item.price}</p>
                  </div>
                </button>
              ))}

              {filteredItems.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center gap-2 p-8 text-white/60">
                  <AlertCircle className="w-8 h-8" />
                  <p className="text-sm">Keine Items gefunden</p>
                </div>
              )}
            </div>
          </div>

          {/* Cart Section */}
          <div className="w-80 flex flex-col">
            <div className="flex items-center gap-2 p-4 border-b border-white/10">
              <ShoppingCart className="w-5 h-5 text-red-500" />
              <span className="text-sm font-medium text-white">Warenkorb</span>
              {cart.length > 0 && (
                <div className="ml-auto flex items-center gap-2">
                  <button
                    onClick={clearCart}
                    className="p-1.5 hover:bg-white/5 rounded-lg transition-colors text-white/70 hover:text-red-500"
                    title="Warenkorb leeren"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">{cart.length}</span>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-2.5 bg-black/40 rounded-lg border border-white/10"
                >
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-11 h-11 object-contain p-1.5 bg-black/20 rounded-md"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-medium text-white truncate">{item.name}</h4>
                    <p className="text-xs text-white/60 mt-0.5">${item.price * item.quantity}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => decrementQuantity(item.id)}
                      className="p-1 hover:bg-white/5 rounded transition-colors"
                    >
                      <Minus className="w-3 h-3 text-white/70" />
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, e.target.value)}
                      className="w-12 px-1 py-0.5 text-xs text-center text-white bg-black/40 border border-white/10 rounded focus:outline-none focus:border-red-500/50"
                    />
                    <button
                      onClick={() => incrementQuantity(item.id)}
                      className="p-1 hover:bg-white/5 rounded transition-colors"
                    >
                      <Plus className="w-3 h-3 text-white/70" />
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-1 hover:bg-white/5 rounded transition-colors ml-1"
                      title="Entfernen"
                    >
                      <Trash2 className="w-3 h-3 text-white/70 hover:text-red-500" />
                    </button>
                  </div>
                </div>
              ))}

              {cart.length === 0 && (
                <div className="flex flex-col items-center justify-center gap-2 py-8 text-white/60">
                  <ShoppingCart className="w-8 h-8" />
                  <p className="text-sm">Dein Warenkorb ist leer</p>
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-4 border-t border-white/10">
                <div className="flex justify-between mb-3">
                  <span className="text-sm text-white/70">Gesamt:</span>
                  <span className="text-sm font-medium text-white">${totalPrice}</span>
                </div>
                <button onClick={checkout} className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium">
                  Kaufen
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}