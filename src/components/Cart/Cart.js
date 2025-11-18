import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import './Cart.css';
import Header from '../Header/Header';
import { Footer } from '../Footer/Footer';
import { useHistory } from 'react-router-dom';

const Cart = () => {
  const { cart, incrementQuantity, decrementQuantity, clearCart } = useCart();
  const [isActive, setActive] = useState(false);
  const history = useHistory();

  const totalPrice = cart.reduce((acc, item) => acc + item.cost * item.quantity, 0);

  if (cart.length === 0 && !isActive) {
    return (
      <div className="cart-empty-page">
        <Header />
        <div className="empty-cart-content">
          <img src="https://res.cloudinary.com/dh8jgl2ue/image/upload/v1763362382/cooking_1_etitk7.png" alt="empty cart" className="empty-cart-img" />
          <h1>No Orders Yet!</h1>
          <p>Your cart is empty.Add Something form menu</p>
          <button
              onClick={() => history.push("/")}
              style={{ margin: "24px auto", padding: "10px 20px", borderRadius: "6px", background: "#ff8200", color: "#fff", border: "none" }}
            >
              Order Now
            </button>
        </div>
        <Footer />
      </div>
    );
  }

  const handlePlaceOrder = () => {
    clearCart();
    setActive(true);
  };

  return (
    <div className="cart-page">
      <Header />
      <div className="cart-body-content">
        {isActive ? (
          <div style={{ textAlign: "center", marginTop: "50px" }}>
            <img src="https://res.cloudinary.com/dh8jgl2ue/image/upload/v1763362335/check-circle.1_1_sbkmeo.png" alt="paymeny-icon" className="Payment-done"/>
            <h1>Payment Successful!</h1>
            <p>Thank you for ordering</p>
            <p>Your payment is successfully completed</p>
            <button
              onClick={() => history.push("/")}
              style={{ margin: "24px auto", padding: "10px 20px", borderRadius: "6px", background: "#ff8200", color: "#fff", border: "none" }}
            >
              Go To Home Page
            </button>
          </div>
        ) : (
          <div className="cart-main-content">
            <div className="cart-table-card">
              <div className="cart-table-header">
                <span className="cart-logo-title">
                  <img src="/logo.png" alt="Tasty Kitchens" className="cart-page-logo" />
                  <span className="cart-page-title">Tasty Kitchens</span>
                </span>
                <nav className="cart-menu-links">
                  <a href="/">Home</a>
                  <a href="/cart">Cart</a>
                  <button className="logout-btn">Logout</button>
                </nav>
              </div>
              <div className="cart-table">
                <div className="cart-table-row cart-table-head-row">
                  <div className="cart-table-cell item-col">Item</div>
                  <div className="cart-table-cell qty-col">Quantity</div>
                  <div className="cart-table-cell price-col">Price</div>
                </div>
                {cart.map(item => (
                  <div className="cart-table-row" key={item.id} data-testid="cartItem">
                    <div className="cart-table-cell item-col">
                      <img src={item.imageUrl} alt={item.name} className="cart-img" />
                      <span>{item.name}</span>
                    </div>
                    <div className="cart-table-cell qty-col">
                      <button data-testid="decrement-quantity" onClick={() => decrementQuantity(item.id)}>-</button>
                      <span data-testid="item-quantity" className="qty-value">{item.quantity}</span>
                      <button data-testid="increment-quantity" onClick={() => incrementQuantity(item.id)}>+</button>
                    </div>
                    <div className="cart-table-cell price-col">₹{item.cost * item.quantity}</div>
                  </div>
                ))}
                <div className="cart-table-row total-row">
                  <div className="cart-table-cell item-col"><b>Order Total :</b></div>
                  <div className="cart-table-cell qty-col"></div>
                  <div className="cart-table-cell price-col">
                    <span data-testid="total-price"><b>₹{totalPrice}</b></span>
                  </div>
                </div>
              </div>
              <button className="place-order-btn" onClick={handlePlaceOrder}>Place Order</button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
