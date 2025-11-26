import {useState, useEffect} from 'react'
import {Link, Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import {useCart} from '../../context/CartContext'

import './Cart.css'
import Header from '../Header/Header'
import Footer from '../Footer/Footer'

const Cart = () => {
  const {
    cart,
    incrementQuantity,
    decrementQuantity,
    clearCart,
    setCartFromOutside,
  } = useCart()

  const [localLoaded, setLocalLoaded] = useState(false)
  const [isPlaced, setIsPlaced] = useState(false)

  const jwtToken = Cookies.get('jwt_token')

  useEffect(() => {
    let isMounted = true

    try {
      const stored = JSON.parse(localStorage.getItem('cartData')) || []
      if (isMounted) {
        setCartFromOutside(stored)
        setLocalLoaded(true)
      }
    } catch {
      if (isMounted) {
        setCartFromOutside([])
        setLocalLoaded(true)
      }
    }

    return () => {
      isMounted = false
    }
  }, [setCartFromOutside])

  useEffect(() => {
    let isMounted = true

    if (localLoaded && isMounted) {
      try {
        localStorage.setItem('cartData', JSON.stringify(cart))
      } catch {
        // ignore
      }
    }

    return () => {
      isMounted = false
    }
  }, [cart, localLoaded])

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.cost * item.quantity,
    0,
  )

  const handlePlaceOrder = () => {
    clearCart()
    setIsPlaced(true)
  }

  if (!jwtToken) {
    return <Redirect to="/login" />
  }

  if (cart.length === 0 && !isPlaced) {
    return (
      <div className="cart-empty-page">
        <Header />

        <div className="empty-cart-content">
          <img
            src="https://res.cloudinary.com/dh8jgl2ue/image/upload/v1763362382/cooking_1_etitk7.png"
            alt="empty cart"
          />
          <h1>No Order Yet!</h1>
          <p>Your cart is empty. Add something from the menu.</p>

          <Link to="/">
            <button type="button">Order now</button>
          </Link>
        </div>

        <Footer />
      </div>
    )
  }

  if (isPlaced) {
    return (
      <div className="cart-page">
        <Header />

        <div style={{textAlign: 'center', marginTop: '50px'}}>
          <img
            src="https://res.cloudinary.com/dh8jgl2ue/image/upload/v1763362335/check-circle.1_1_sbkmeo.png"
            alt="payment-icon"
          />
          <h1>Payment Successful</h1>
          <p>Thank you for ordering Your payment is successfully completed.</p>

          <Link to="/">
            <button type="button">Go To Home</button>
          </Link>
        </div>

        <Footer />
      </div>
    )
  }

  return (
    <div className="cart-page">
      <Header />

      <div className="cart-body-content">
        <div className="cart-main-content">
          <div className="cart-table-card">
            <div className="cart-table">
              <div className="cart-table-row cart-table-head-row">
                <div className="cart-table-cell item-col">Item</div>
                <div className="cart-table-cell qty-col">Quantity</div>
                <div className="cart-table-cell price-col">Price</div>
              </div>

              {cart.map(item => (
                <div
                  className="cart-table-row"
                  key={item.id}
                  data-testid="cartItem"
                >
                  <div className="cart-table-cell item-col">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="cart-img"
                    />
                    <h3>{item.name}</h3>
                  </div>

                  <div className="cart-table-cell qty-col">
                    <button
                      data-testid="decrement-quantity"
                      type="button"
                      onClick={() => decrementQuantity(item.id)}
                    >
                      -
                    </button>

                    <p data-testid="item-quantity">{item.quantity}</p>

                    <button
                      data-testid="increment-quantity"
                      type="button"
                      onClick={() => incrementQuantity(item.id)}
                    >
                      +
                    </button>
                  </div>

                  <div className="cart-table-cell price-col">
                    <p>₹{item.cost * item.quantity}</p>
                  </div>
                </div>
              ))}

              <div className="cart-table-row total-row">
                <div className="cart-table-cell item-col">
                  <h3>Order Total:</h3>
                </div>
                <div className="cart-table-cell qty-col" />
                <div className="cart-table-cell price-col">
                  <p data-testid="total-price">
                    <b>₹{totalPrice}</b>
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="place-order-btn"
              onClick={handlePlaceOrder}
            >
              Place Order
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Cart
