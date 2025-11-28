import {useEffect, useState} from 'react'
import {Redirect, Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Header from '../Header/Header'
import Footer from '../Footer/Footer'
import './Cart.css'

const Cart = () => {
  const jwtToken = Cookies.get('jwt_token')

  const [cart, setCart] = useState([])
  const [isPlaced, setIsPlaced] = useState(false)

  /* LOAD CART FROM LOCAL STORAGE */
  useEffect(() => {
    try {
      const stored = localStorage.getItem('cartData')
      const parsed = stored ? JSON.parse(stored) : []
      setCart(parsed)
    } catch {
      setCart([])
    }
  }, [])

  /* SAVE CART */
  const saveCart = updated => {
    localStorage.setItem('cartData', JSON.stringify(updated))
    setCart(updated)
  }

  const increment = id => {
    const updated = cart.map(item =>
      item.id === id ? {...item, quantity: item.quantity + 1} : item,
    )
    saveCart(updated)
  }

  const decrement = id => {
    const updated = cart
      .map(item =>
        item.id === id ? {...item, quantity: item.quantity - 1} : item,
      )
      .filter(item => item.quantity > 0)

    saveCart(updated)
  }

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.cost * item.quantity,
    0,
  )

  const handlePlaceOrder = () => {
    localStorage.removeItem('cartData')
    setCart([])
    setIsPlaced(true)
  }

  if (!jwtToken) return <Redirect to="/login" />

  /* EMPTY CART */
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
            <button type="button">Order Now</button>
          </Link>
        </div>

        <Footer />
      </div>
    )
  }

  /* PAYMENT SUCCESS */
  if (isPlaced) {
    return (
      <div className="cart-page">
        <Header />

        <div className="payment-success-section">
          <img
            src="https://assets.ccbp.in/frontend/react-js/check-circle-img.png"
            alt="payment successful"
          />
          <h1>Payment Successful</h1>
          <p>Thank you for ordering Your payment is successfully completed.</p>

          <Link to="/">
            <button type="button">Go To Home Page</button>
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
                      onClick={() => decrement(item.id)}
                    >
                      -
                    </button>

                    <p data-testid="item-quantity">{item.quantity}</p>

                    <button
                      data-testid="increment-quantity"
                      type="button"
                      onClick={() => increment(item.id)}
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
                <h3>Order Total:</h3>
                <p data-testid="total-price">
                  <b>₹{totalPrice}</b>
                </p>
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
