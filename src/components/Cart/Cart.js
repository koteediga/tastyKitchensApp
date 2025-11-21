import React, {useState, useEffect} from 'react'
import {Link, Redirect, useHistory} from 'react-router-dom'
import Cookies from 'js-cookie'
import {useCart} from '../../context/CartContext'
import './Cart.css'
import Header from '../Header/Header'
import Footer from '../Footer/Footer'

const Cart = () => {
  const history = useHistory()

  const jwtToken = Cookies.get('jwt_token')
  if (jwtToken === undefined) {
    return <Redirect to="/login" />
  }

  const {
    cart,
    incrementQuantity,
    decrementQuantity,
    clearCart,
    setCartFromOutside,
  } = useCart()

  const [localLoaded, setLocalLoaded] = useState(false)
  const [isPlaced, setIsPlaced] = useState(false)

  /* ---------------- LOAD CART FROM LOCALSTORAGE ---------------- */
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('cartData')) || []
      setCartFromOutside(stored)
      setLocalLoaded(true)
    } catch {
      setCartFromOutside([])
      setLocalLoaded(true)
    }
  }, [setCartFromOutside])

  /* ---------------- SYNC CONTEXT -> LOCALSTORAGE ---------------- */
  useEffect(() => {
    if (localLoaded) {
      try {
        localStorage.setItem('cartData', JSON.stringify(cart))
      } catch {}
    }
  }, [cart, localLoaded])

  /* ---------------- CALCULATE TOTAL ---------------- */
  const totalPrice = cart.reduce(
    (acc, item) => acc + item.cost * item.quantity,
    0,
  )

  /* ---------------- EMPTY CART VIEW ---------------- */
  if (cart.length === 0 && !isPlaced) {
    return (
      <div className="cart-empty-page">
        <Header />

        <div className="empty-cart-content">
          <img
            src="https://assets.ccbp.in/frontend/react-js/no-orders-img.png"
            alt="empty cart"
          />
          <h1>No Order Yet!</h1>
          <p>Your cart is empty. Add something from the menu.</p>

          <Link to="/">
            <button type="button">Order Now</button>
          </Link>
        </div>

        <Footer />
      </div>
    )
  }

  /* ---------------- PLACE ORDER ---------------- */
  const handlePlaceOrder = () => {
    clearCart()
    setIsPlaced(true)
  }

  return (
    <div className="cart-page">
      <Header />

      <div className="cart-body-content">
        {isPlaced ? (
          <div style={{textAlign: 'center', marginTop: '50px'}}>
            <img
              src="https://assets.ccbp.in/frontend/react-js/payment-success-img.png"
              alt="payment-icon"
            />
            <h1>Payment Successful</h1>
            <p>
              Thank you for ordering. Your payment is successfully completed.
            </p>

            <Link to="/">
              <button type="button">Go To Home Page</button>
            </Link>
          </div>
        ) : (
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
                    <h3>Order Total :</h3>
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
        )}
      </div>

      <Footer />
    </div>
  )
}

export default Cart
