import {useEffect, useState} from 'react'
import {useParams, Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import Header from '../Header/Header'
import Footer from '../Footer/Footer'
import './RestaurantDetail.css'

const RestaurantDetail = () => {
  const {id} = useParams()
  const jwtToken = Cookies.get('jwt_token')

  const [restaurant, setRestaurant] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load cart from LocalStorage
  const [cart, setCart] = useState(() => {
    try {
      const stored = localStorage.getItem('cartData')
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  /* ---------------- FETCH RESTAURANT DETAILS ---------------- */
  useEffect(() => {
    if (!jwtToken) return

    let isMounted = true

    const fetchData = async () => {
      setLoading(true)
      try {
        const response = await fetch(
          `https://apis.ccbp.in/restaurants-list/${id}`,
          {
            headers: {Authorization: `Bearer ${jwtToken}`},
          },
        )

        const data = await response.json()

        if (isMounted) {
          setRestaurant(data)
          setLoading(false)
        }
      } catch {
        if (isMounted) setLoading(false)
      }
    }

    fetchData()

    return () => {
      isMounted = false
    }
  }, [id, jwtToken])

  /* ---------------- CART MANAGEMENT ---------------- */
  const saveCart = newCart => {
    localStorage.setItem('cartData', JSON.stringify(newCart))
    setCart(newCart)
  }

  const addItem = food => {
    const newItem = {
      id: food.id,
      name: food.name,
      cost: food.cost,
      imageUrl: food.image_url,
      rating: food.rating,
      quantity: 1,
    }
    saveCart([...cart, newItem])
  }

  const increment = foodId => {
    const updated = cart.map(item =>
      item.id === foodId ? {...item, quantity: item.quantity + 1} : item,
    )
    saveCart(updated)
  }

  const decrement = foodId => {
    const updated = cart
      .map(item =>
        item.id === foodId ? {...item, quantity: item.quantity - 1} : item,
      )
      .filter(item => item.quantity > 0)

    saveCart(updated)
  }

  const getQty = foodId => {
    const found = cart.find(item => item.id === foodId)
    return found ? found.quantity : 0
  }

  if (!jwtToken) return <Redirect to="/login" />

  if (loading) {
    return (
      <div className="loader-cont" data-testid="restaurant-details-loader">
        <div className="loader" />
      </div>
    )
  }

  const {
    image_url,
    name,
    cuisine,
    location,
    rating,
    reviews_count,
    cost_for_two,
    food_items,
  } = restaurant

  return (
    <>
      <Header />

      <div className="restaurant-detail-wrapper">
        <div className="restaurant-banner">
          <img src={image_url} alt="restaurant" className="banner-image" />

          <div className="banner-info">
            <h2 className="restaurant-name">{name}</h2>
            <p className="cuisine">{cuisine}</p>
            <p className="location">{location}</p>
            <p>{rating}</p>
            <p>{reviews_count}</p>
            <p>Cost for two</p>
            <p>{cost_for_two}</p>
          </div>
        </div>

        <ul className="menu-list">
          {food_items.map(food => {
            const qty = getQty(food.id)

            return (
              <li key={food.id} className="menu-card" data-testid="foodItem">
                <img
                  src={food.image_url}
                  alt={food.name}
                  className="menu-image"
                />

                <div className="menu-info">
                  <h3>{food.name}</h3>
                  <p>{food.cost}</p>
                  <p>{food.rating}</p>

                  {qty === 0 ? (
                    <button type="button" onClick={() => addItem(food)}>
                      Add
                    </button>
                  ) : (
                    <div className="qty-controls">
                      {qty > 0 && (
                        <button
                          type="button"
                          data-testid="decrement-count"
                          onClick={() => decrement(food.id)}
                        >
                          -
                        </button>
                      )}

                      {qty > 0 && <p data-testid="active-count">{qty}</p>}

                      {qty > 0 && (
                        <button
                          type="button"
                          data-testid="increment-count"
                          onClick={() => increment(food.id)}
                        >
                          +
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      </div>

      <Footer />
    </>
  )
}

export default RestaurantDetail
