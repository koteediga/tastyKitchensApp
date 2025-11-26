// import {useEffect, useState} from 'react'
// import {useParams, Redirect} from 'react-router-dom'
// import Cookies from 'js-cookie'
// import Footer from '../Footer/Footer'
// import Header from '../Header/Header'
// import './RestaurantDetail.css'

// const RestaurantDetail = () => {
//   const {id} = useParams()
//   const jwtToken = Cookies.get('jwt_token')

//   const [restaurant, setRestaurant] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [cart, setCart] = useState(() => {
//     try {
//       return JSON.parse(localStorage.getItem('cartData')) || []
//     } catch {
//       return []
//     }
//   })

//   /* ---------------- LOAD DETAILS ---------------- */
//   useEffect(() => {
//     if (!jwtToken) return undefined

//     let isMounted = true

//     const fetchDetails = async () => {
//       try {
//         setLoading(true)

//         const response = await fetch(
//           `https://apis.ccbp.in/restaurants-list/${id}`,
//           {headers: {Authorization: `Bearer ${jwtToken}`}},
//         )

//         const data = await response.json()

//         if (isMounted) {
//           setRestaurant(data)
//           setLoading(false)
//         }
//       } catch {
//         if (isMounted) setLoading(false)
//       }
//     }

//     fetchDetails()

//     return () => {
//       isMounted = false
//     }
//   }, [id, jwtToken])

//   /* ---------------- CART HELPERS ---------------- */
//   const updateLocalStorage = updatedCart => {
//     localStorage.setItem('cartData', JSON.stringify(updatedCart))
//     setCart(updatedCart)
//   }

//   const addItem = food => {
//     const newItem = {
//       id: food.id,
//       name: food.name,
//       cost: food.cost,
//       imageUrl: food.image_url,
//       rating: food.rating,
//       quantity: 1,
//     }
//     updateLocalStorage([...cart, newItem])
//   }

//   const increment = foodId => {
//     updateLocalStorage(
//       cart.map(each =>
//         each.id === foodId ? {...each, quantity: each.quantity + 1} : each,
//       ),
//     )
//   }

//   const decrement = foodId => {
//     updateLocalStorage(
//       cart
//         .map(each =>
//           each.id === foodId ? {...each, quantity: each.quantity - 1} : each,
//         )
//         .filter(each => each.quantity > 0),
//     )
//   }

//   const getQty = foodId => {
//     const found = cart.find(item => item.id === foodId)
//     return found ? found.quantity : 0
//   }

//   /* ---------------- AUTH REDIRECT ---------------- */
//   if (!jwtToken) return <Redirect to="/login" />

//   if (loading)
//     return <div data-testid="restaurant-details-loader">Loading...</div>

//   /* ---------------- UI ---------------- */
//   return (
//     <div className="restaurant-details-page">
//       <Header />

//       <section className="restaurant-banner">
//         <img src={restaurant.image_url} alt="restaurant" />
//         <h1>{restaurant.name}</h1>
//         <p>{restaurant.cuisine}</p>
//         <p>{restaurant.location}</p>
//         <p>{restaurant.rating}</p>
//         <p>{restaurant.reviews_count}</p>
//         <p>Cost for two</p>
//         <p>{restaurant.cost_for_two}</p>
//       </section>

//       <ul className="food-items-list">
//         {restaurant.food_items.map(food => {
//           const qty = getQty(food.id)

//           return (
//             <li key={food.id} data-testid="foodItem">
//               <img src={food.image_url} alt={food.name} />
//               <h3>{food.name}</h3>
//               <p>{food.cost}</p>
//               <p>{food.rating}</p>

//               {qty === 0 ? (
//                 <button type="button" onClick={() => addItem(food)}>
//                   Add
//                 </button>
//               ) : (
//                 <div className="qty-controls">
//                   <button
//                     type="button"
//                     data-testid="decrement-count"
//                     onClick={() => decrement(food.id)}
//                   >
//                     -
//                   </button>

//                   <p data-testid="active-count">{qty}</p>

//                   <button
//                     type="button"
//                     data-testid="increment-count"
//                     onClick={() => increment(food.id)}
//                   >
//                     +
//                   </button>
//                 </div>
//               )}
//             </li>
//           )
//         })}
//       </ul>

//       <Footer />
//     </div>
//   )
// }

// export default RestaurantDetail
import React, {useEffect, useState} from 'react'
import {useParams, Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import Header from '../Header/Header'
import Footer from '../Footer/Footer'
import './RestaurantDetail.css'

const RestaurantDetail = () => {
  const params = useParams()
  const restaurantId = params.id

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

    let isMounted = true

    const getDetails = async () => {
      try {
        const response = await fetch(
          `https://apis.ccbp.in/restaurants-list/${restaurantId}`,
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

    getDetails()

    return () => {
      isMounted = false
    }
  }, [restaurantId, jwtToken])

  /* ---------------- CART FUNCTIONS ---------------- */

  const saveCart = updatedCart => {
    localStorage.setItem('cartData', JSON.stringify(updatedCart))
    setCart(updatedCart)
  }

  const addItem = food => {
    const updated = [
      ...cart,
      {
        id: food.id,
        name: food.name,
        cost: food.cost,
        imageUrl: food.image_url,
        rating: food.rating,
        quantity: 1,
      },
    ]
    saveCart(updated)
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
        {/* BANNER */}
        <div className="restaurant-banner">
          <img src={image_url} alt="restaurant" className="banner-image" />

          <div className="banner-info">
            <h2 className="restaurant-name">{name}</h2>
            <p className="cuisine">{cuisine}</p>
            <p className="location">{location}</p>

            <div className="rating-cost">
              ⭐ {rating} | {reviews_count}+ Reviews | ₹{cost_for_two} Cost for
              Two
            </div>
          </div>
        </div>

        {/* MENU */}
        <h2 style={{marginBottom: '20px'}}>Menu</h2>

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
                  <p>₹ {food.cost}</p>
                  <span>{food.rating} ⭐</span>

                  {qty === 0 ? (
                    <button
                      type="button"
                      className="add-btn"
                      onClick={() => addItem(food)}
                    >
                      Add
                    </button>
                  ) : (
                    <div className="qty-controls">
                      <button
                        type="button"
                        data-testid="decrement-count"
                        onClick={() => decrement(food.id)}
                      >
                        -
                      </button>

                      <p data-testid="active-count">{qty}</p>

                      <button
                        type="button"
                        data-testid="increment-count"
                        onClick={() => increment(food.id)}
                      >
                        +
                      </button>
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
