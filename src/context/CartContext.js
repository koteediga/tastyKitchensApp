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
    } catch (e) {
      console.log(e)
    }
  }, [cart])

  const addToCart = item => {
    setCart(prev => {
      const index = prev.findIndex(i => i.id === item.id)
      if (index !== -1) {
        return prev.map((i, ind) =>
          ind === index ? {...i, quantity: i.quantity + 1} : i,
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

  const clearCart = () => setCart([])

  return (
    <CartContext.Provider
      value={{cart, addToCart, incrementQuantity, decrementQuantity, clearCart}}
    >
      {children}
    </CartContext.Provider>
  )
}
