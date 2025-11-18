import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const stored = localStorage.getItem("cartData");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("cartData", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item) => {
    setCart(prevCart => {
      const idx = prevCart.findIndex(i => i.id === item.id);
      if (idx !== -1) {
        // Already in cart, increment quantity
        return prevCart.map((i, ind) =>
          ind === idx ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      // Add new item with quantity 1
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const incrementQuantity = (id) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decrementQuantity = (id) => {
    setCart(prevCart =>
      prevCart
        .map(item =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter(item => item.quantity > 0)
    );
  };

  const clearCart=()=>{
    setCart([]);
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, incrementQuantity, decrementQuantity ,clearCart}}>
      {children}
    </CartContext.Provider>
  );
};
