import React, {useState, useEffect} from 'react'
import Cookies from 'js-cookie'
import {Redirect, Link, useHistory} from 'react-router-dom'
import Slider from 'react-slick'
import Header from '../Header/Header'
import Footer from '../Footer/Footer'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

const sortByOptions = [
  {id: 1, displayText: 'Lowest', value: 'Lowest'},
  {id: 2, displayText: 'Highest', value: 'Highest'},
]

const LIMIT = 9

const Home = () => {
  const history = useHistory()
  const jwtToken = Cookies.get('jwt_token')

  if (!jwtToken) {
    return <Redirect to="/login" />
  }

  const [offers, setOffers] = useState([])
  const [restaurants, setRestaurants] = useState([])

  const [offersLoading, setOffersLoading] = useState(true)
  const [restaurantsLoading, setRestaurantsLoading] = useState(true)

  const [sortBy, setSortBy] = useState('Lowest')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const onLogout = () => {
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  // Fetch Offers
  useEffect(() => {
    const fetchOffers = async () => {
      const response = await fetch(
        'https://apis.ccbp.in/restaurants-list/offers',
        {
          headers: {Authorization: `Bearer ${jwtToken}`},
        },
      )
      const data = await response.json()
      setOffers(data.offers)
      setOffersLoading(false)
    }

    fetchOffers()
  }, [jwtToken])

  // Fetch Restaurants
  useEffect(() => {
    const offset = (page - 1) * LIMIT

    const fetchRestaurants = async () => {
      const url = `https://apis.ccbp.in/restaurants-list?offset=${offset}&limit=${LIMIT}&sort_by_rating=${sortBy}`

      const response = await fetch(url, {
        headers: {Authorization: `Bearer ${jwtToken}`},
      })
      const data = await response.json()

      setRestaurants(data.restaurants)
      setTotalPages(Math.ceil((data.total || LIMIT) / LIMIT))
      setRestaurantsLoading(false)
    }

    fetchRestaurants()
  }, [jwtToken, page, sortBy])

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
  }

  return (
    <div className="home-container">
      <Header onLogout={onLogout} />

      {offersLoading ? (
        <div data-testid="restaurants-offers-loader">Loading...</div>
      ) : (
        <Slider {...sliderSettings}>
          {offers.map(each => (
            <div key={each.id}>
              <img src={each.image_url} alt="offer" className="offer-img" />
            </div>
          ))}
        </Slider>
      )}

      <h1>Popular Restaurants</h1>
      <p>
        Select Your favourite restaurant special dish and make your day happy...
      </p>

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

      {restaurantsLoading ? (
        <div data-testid="restaurants-list-loader">Loading...</div>
      ) : (
        <ul className="restaurant-list">
          {restaurants.map(each => (
            <li key={each.id} data-testid="restaurant-item">
              <Link to={`/restaurant/${each.id}`}>
                <img src={each.image_url} alt={each.name} />
                <h3>{each.name}</h3>
                <p>{each.cuisine}</p>
                <p>{each.user_rating.rating}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <div className="pagination">
        <button
          data-testid="pagination-left-button"
          onClick={() => setPage(prev => Math.max(1, prev - 1))}
          disabled={page === 1}
        >
          &lt;
        </button>

        <p data-testid="active-page-number">{page}</p>

        <button
          data-testid="pagination-right-button"
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
