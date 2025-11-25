import React, {useEffect, useState} from 'react'
import {useParams, Link, Redirect, useHistory} from 'react-router-dom'
import Cookies from 'js-cookie'
import Footer from '../Footer/Footer'
import './RestaurantDetail.css'

const RestaurantDetail = () => {
  const {id} = useParams()
  const history = useHistory()
  const jwtToken = Cookies.get('jwt_token')

  const [restaurant, setRestaurant] = useState(null)
  const [loading, setLoading] = useState(true)
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cartData')) || []
    } catch {
      return []
    }
  })

  /* ---------------- FETCH DETAILS ---------------- */
  useEffect(() => {
    if (!jwtToken) return

    const fetchDetails = async () => {
      setLoading(true)

      const response = await fetch(
        `https://apis.ccbp.in/restaurants-list/${id}`,
        {headers: {Authorization: `Bearer ${jwtToken}`}},
      )

      const data = await response.json()
      setRestaurant(data)
      setLoading(false)
    }

    fetchDetails()
  }, [id, jwtToken])

  /* ---------------- UPDATE LOCAL STORAGE ---------------- */
  const updateLocalStorage = updatedCart => {
    localStorage.setItem('cartData', JSON.stringify(updatedCart))
    setCart(updatedCart)
  }

  /* ---------------- ADD ITEM ---------------- */
  const addItem = item => {
    const newItem = {
      id: item.id,
      name: item.name,
      cost: item.cost,
      imageUrl: item.image_url,
      rating: item.rating,
      quantity: 1,
    }

    updateLocalStorage([...cart, newItem])
  }

  /* ---------------- INCREMENT ---------------- */
  const increment = foodId => {
    updateLocalStorage(
      cart.map(each =>
        each.id === foodId ? {...each, quantity: each.quantity + 1} : each,
      ),
    )
  }

  /* ---------------- DECREMENT ---------------- */
  const decrement = foodId => {
    updateLocalStorage(
      cart
        .map(each =>
          each.id === foodId ? {...each, quantity: each.quantity - 1} : each,
        )
        .filter(each => each.quantity > 0),
    )
  }

  const onLogout = () => {
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  // 🔥 AUTH REDIRECT AFTER HOOKS (SAFE)
  if (!jwtToken) {
    return <Redirect to="/login" />
  }

  if (loading) {
    return <div data-testid="restaurant-details-loader">Loading...</div>
  }

  const getQty = foodId => {
    const f = cart.find(item => item.id === foodId)
    return f ? f.quantity : 0
  }

  return (
    <div className="restaurant-details-page">
      {/* HEADER */}
      <header className="restaurant-header">
        <Link to="/">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
          />
        </Link>

        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/cart">Cart</Link>
          </li>
          <li>Offers</li>
          <li>Contact</li>
        </ul>

        <button type="button" onClick={onLogout}>
          Logout
        </button>
      </header>

      {/* BANNER */}
      <section>
        <img src={restaurant.image_url} alt="restaurant" />
        <h1>{restaurant.name}</h1>
        <p>{restaurant.cuisine}</p>
        <p>{restaurant.location}</p>
        <p>{restaurant.rating}</p>
        <p>{restaurant.reviews_count}</p>
        <p>Cost for two</p>
        <p>{restaurant.cost_for_two}</p>
      </section>

      {/* FOOD ITEMS */}
      <ul className="food-items-list">
        {restaurant.food_items.map(item => {
          const qty = getQty(item.id)

          return (
            <li key={item.id} data-testid="foodItem">
              <img src={item.image_url} alt={item.name} />
              <h3>{item.name}</h3>
              <p>{item.cost}</p>
              <p>{item.rating}</p>

              {qty === 0 ? (
                <button type="button" onClick={() => addItem(item)}>
                  Add
                </button>
              ) : (
                <div className="qty-controls">
                  <button
                    type="button"
                    data-testid="decrement-count"
                    onClick={() => decrement(item.id)}
                  >
                    -
                  </button>

                  <p data-testid="active-count">{qty}</p>

                  <button
                    type="button"
                    data-testid="increment-count"
                    onClick={() => increment(item.id)}
                  >
                    +
                  </button>
                </div>
              )}
            </li>
          )
        })}
      </ul>

      <Footer />
    </div>
  )
}

export default RestaurantDetail
