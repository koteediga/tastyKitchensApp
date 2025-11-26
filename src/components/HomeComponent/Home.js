// import Header from '../Header/Header'
// import Footer from '../Footer/Footer'

// const Home = () => (
//   <div>
//     <Header />

//     <h1>Popular Restaurants</h1>
//     <p>
//       Select Your favourite restaurant special dish and make your day happy...
//     </p>

//     <h2>Restaurant List</h2>

//     <ul>
//       <li>Restaurant 1</li>
//       <li>Restaurant 2</li>
//       <li>Restaurant 3</li>
//     </ul>

//     <button type="button">Next</button>

//     <Footer />
//   </div>
// )

// export default Home

import {useState, useEffect} from 'react'
import Cookies from 'js-cookie'
import {Redirect, Link} from 'react-router-dom'
import Slider from 'react-slick'
import Header from '../Header/Header'
import Footer from '../Footer/Footer'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import './Home.css'

const sortByOptions = [
  {id: 1, displayText: 'Lowest', value: 'Lowest'},
  {id: 2, displayText: 'Highest', value: 'Highest'},
]

const LIMIT = 9

const Home = () => {
  const jwtToken = Cookies.get('jwt_token')

  const [offers, setOffers] = useState([])
  const [restaurants, setRestaurants] = useState([])
  const [offersLoading, setOffersLoading] = useState(true)
  const [restaurantsLoading, setRestaurantsLoading] = useState(true)
  const [sortBy, setSortBy] = useState('Lowest')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  /* ---------------- FETCH OFFERS ---------------- */
  useEffect(() => {
    if (!jwtToken) return undefined

    let isMounted = true

    const fetchOffers = async () => {
      try {
        const response = await fetch(
          'https://apis.ccbp.in/restaurants-list/offers',
          {
            headers: {Authorization: `Bearer ${jwtToken}`},
          },
        )
        const data = await response.json()

        if (isMounted) {
          setOffers(data.offers)
          setOffersLoading(false)
        }
      } catch {
        if (isMounted) {
          setOffersLoading(false)
        }
      }
    }

    fetchOffers()

    return () => {
      isMounted = false
    }
  }, [jwtToken])

  /* ---------------- FETCH RESTAURANTS ---------------- */
  useEffect(() => {
    if (!jwtToken) return undefined

    let isMounted = true
    const offset = (page - 1) * LIMIT

    const fetchRestaurants = async () => {
      try {
        const url = `https://apis.ccbp.in/restaurants-list?offset=${offset}&limit=${LIMIT}&sort_by_rating=${sortBy}`

        const response = await fetch(url, {
          headers: {Authorization: `Bearer ${jwtToken}`},
        })
        const data = await response.json()

        if (isMounted) {
          setRestaurants(data.restaurants)
          setTotalPages(Math.ceil((data.total || LIMIT) / LIMIT))
          setRestaurantsLoading(false)
        }
      } catch {
        if (isMounted) {
          setRestaurantsLoading(false)
        }
      }
    }

    fetchRestaurants()

    return () => {
      isMounted = false
    }
  }, [jwtToken, page, sortBy])

  /* ---------------- REDIRECT IF UNAUTHENTICATED ---------------- */
  if (!jwtToken) {
    return <Redirect to="/login" />
  }

  /* ---------------- SLIDER SETTINGS ---------------- */
  const sliderSettings = {
    dots: false,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 500,
  }

  return (
    <div className="home-container">
      <Header />

      {/* OFFERS LOADER */}
      {offersLoading ? (
        <div data-testid="restaurants-offers-loader">Loading...</div>
      ) : (
        <Slider {...sliderSettings}>
          {offers.map(offer => (
            <div key={offer.id}>
              <img src={offer.image_url} alt="offer" className="offer-img" />
            </div>
          ))}
        </Slider>
      )}

      <h1>Popular Restaurants</h1>
      <p>
        Select Your favourite restaurant special dish and make your day happy...
      </p>

      {/* SORT SECTION */}
      <div className="sort-container">
        <p>Sort By</p>
        <select
          value={sortBy}
          onChange={e => {
            setSortBy(e.target.value)
            setPage(1)
          }}
        >
          {sortByOptions.map(option => (
            <option key={option.id} value={option.value}>
              {option.displayText}
            </option>
          ))}
        </select>
      </div>

      {/* RESTAURANTS LIST */}
      {restaurantsLoading ? (
        <div data-testid="restaurants-list-loader">Loading...</div>
      ) : (
        <ul className="restaurant-list">
          {restaurants.map(item => (
            <li key={item.id} data-testid="restaurant-item">
              <Link to={`/restaurant/${item.id}`}>
                <img src={item.image_url} alt={item.name} />
                <h3>{item.name}</h3>
                <p>{item.cuisine}</p>
                <p>{item.user_rating?.rating}</p>
                <h3>{item.user_rating?.total_reviews}</h3>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {/* PAGINATION */}
      <div className="pagination">
        <button
          data-testid="pagination-left-button"
          type="button"
          onClick={() => setPage(prev => Math.max(1, prev - 1))}
          disabled={page === 1}
        >
          &lt;
        </button>

        <p data-testid="active-page-number">{page}</p>

        <button
          data-testid="pagination-right-button"
          type="button"
          onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
          disabled={page === totalPages}
        >
          &gt;
        </button>
      </div>

      <Footer />
    </div>
  )
}

export default Home
