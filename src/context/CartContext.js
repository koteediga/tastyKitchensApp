import {createContext, useContext, useState, useEffect} from 'react'

const CartContext = createContext()
export const useCart = () => useContext(CartContext)

export const CartProvider = ({children}) => {
  const [cart, setCart] = useState(() => {
    try {
      const stored = localStorage.getItem('cartData')
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  // keep localStorage in sync whenever cart changes
  useEffect(() => {
    try {
      localStorage.setItem('cartData', JSON.stringify(cart))
    } catch {
      // ignore
    }
  }, [cart])

  // used by Cart component when it loads from localStorage on mount
  const setCartFromOutside = newCart => {
    setCart(newCart)
  }

  const addToCart = item => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id)
      if (existing) {
        return prev.map(i =>
          i.id === item.id ? {...i, quantity: i.quantity + 1} : i,
        )
      }
      return [...prev, {...item, quantity: 1}]
    })
  }

  const incrementQuantity = id => {
    setCart(prev =>
      prev.map(item =>
        item.id === id ? {...item, quantity: item.quantity + 1} : item,
      ),
    )
  }

  const decrementQuantity = id => {
    setCart(prev =>
      prev
        .map(item =>
          item.id === id ? {...item, quantity: item.quantity - 1} : item,
        )
        .filter(item => item.quantity > 0),
    )
  }

  const clearCart = () => {
    localStorage.removeItem('cartData')
    setCart([])
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        incrementQuantity,
        decrementQuantity,
        clearCart,
        setCartFromOutside,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
