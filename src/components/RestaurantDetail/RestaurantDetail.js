import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import "./RestaurantDetail.css";
import { useCart } from "../../context/CartContext";
 import Header from "../Header/Header";
import { Footer } from "../Footer/Footer";

const jwtToken = Cookies.get("jwt_token");
const requestOptions = {
  headers: { Authorization: `Bearer ${jwtToken}` },
};

const RestaurantDetail = () => {
  const { restaurantId } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  const { cart, addToCart, incrementQuantity, decrementQuantity } = useCart();

  useEffect(() => {
    async function fetchRestaurant() {
      setLoading(true);
      const response = await fetch(
        `https://apis.ccbp.in/restaurants-list/${restaurantId}`,
        requestOptions
      );
      const data = await response.json();
      setRestaurant(data);
      setLoading(false);
    }
    fetchRestaurant();
  }, [restaurantId]);

  if (loading) return <h2 style={{ textAlign: "center" }}>Loading...</h2>;
  if (!restaurant) return <h3 style={{ textAlign: "center" }}>No data found.</h3>;

  return (
    <div>
      <div>
        <Header />
      </div>
    <div className="restaurant-detail-wrapper">
      {/* Banner Section */}
      <div className="restaurant-banner">
        <img src={restaurant.image_url} alt={restaurant.name} className="banner-image" />
        <div className="banner-info">
          <h1 className="restaurant-name">{restaurant.name}</h1>
          <p className="cuisine">{restaurant.cuisine}</p>
          <p className="location">{restaurant.location}</p>
          <div className="rating-cost">
            <span style={{ marginRight: "1.5rem" }}>⭐ {restaurant.rating}</span>
            <span>Open: {restaurant.opens_at}</span>
            <span style={{ marginLeft: "1.5rem" }}>Menu Items: {restaurant.items_count}</span>
          </div>
        </div>
      </div>

      {/* Menu Grid Section */}
      <div className="menu-list">
        {restaurant.food_items.map((item) => {
          const cartItem = cart.find((ci) => ci.id === item.id);
          return (
            <div key={item.id} className="menu-card">
              <img src={item.image_url} alt={item.name} className="menu-image" />
              <div className="menu-info">
                <h3>{item.name}</h3>
                <p>₹{item.cost}</p>
                <span>{item.food_type}</span>
                {!cartItem ? (
                  <button
                    className="add-btn"
                    onClick={() =>
                      addToCart({
                        cost: item.cost,
                        quantity: 1,
                        id: item.id,
                        imageUrl: item.image_url,
                        name: item.name,
                      })
                    }
                  >
                    Add
                  </button>
                ) : (
                  <div>
                    <button
                      data-testid="decrement-quantity"
                      onClick={() => decrementQuantity(item.id)}
                    >−</button>
                    <span data-testid="item-quantity">{cartItem.quantity}</span>
                    <button
                      data-testid="increment-quantity"
                      onClick={() => incrementQuantity(item.id)}
                    >+</button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
    <div>
      <Footer />
    </div>
    </div>
  );
};
export default RestaurantDetail;
