import React, {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Slider from 'react-slick'
import Footer from '../Footer/Footer'
import './RestaurantDetails.css'

const sortByOptions = [
  {id: 1, displayText: 'Lowest', value: 'Lowest'},
  {id: 2, displayText: 'Highest', value: 'Highest'},
]

const RESTAURANTS_LIMIT = 9

const RestaurantDetails = () => {
  const token = Cookies.get('jwt_token')
  const requestOptions = {headers: {Authorization: `Bearer ${token}`}}

  const [loadingOffers, setLoadingOffers] = useState(false)
  const [offers, setOffers] = useState([])

  const [loadingRestaurants, setLoadingRestaurants] = useState(false)
  const [restaurants, setRestaurants] = useState([])

  const [sortBy, setSortBy] = useState('Lowest')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)

  // Fetch offers
  useEffect(() => {
    const fetchOffers = async () => {
      setLoadingOffers(true)
      try {
        const res = await fetch(
          'https://apis.ccbp.in/restaurants-list/offers',
          requestOptions,
        )
        const data = await res.json()
        setOffers(data.offers || [])
      } catch {
        setOffers([])
      }
      setLoadingOffers(false)
    }
    fetchOffers()
  }, [token])

  // Fetch restaurants list
  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoadingRestaurants(true)

      const offset = (page - 1) * RESTAURANTS_LIMIT
      const url = `https://apis.ccbp.in/restaurants-list?offset=${offset}&limit=${RESTAURANTS_LIMIT}&sort_by_rating=${sortBy}`

      try {
        const res = await fetch(url, requestOptions)
        const data = await res.json()

        setRestaurants(data.restaurants || [])
        setTotalPages(Math.ceil((data.total || 9) / RESTAURANTS_LIMIT))
      } catch {
        setRestaurants([])
      }

      setLoadingRestaurants(false)
    }
    fetchRestaurants()
  }, [token, page, sortBy])

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
  }

  return (
    <div className="home-container">
      <h2>Popular Restaurants</h2>
      <p>
        Select Your favourite restaurant special dish and make your day happy...
      </p>

      {/* Offers slider */}
      {loadingOffers ? (
        <div data-testid="restaurants-offers-loader">Loading offers...</div>
      ) : (
        offers.length > 0 && (
          <Slider {...sliderSettings}>
            {offers.map(each => (
              <img
                key={each.id}
                src={each.image_url}
                alt="offer"
                className="offer-image"
              />
            ))}
          </Slider>
        )
      )}

      {/* Sort by */}
      <div className="sortby-block">
        <p>Sort By</p>
        <select
          id="sortby"
          value={sortBy}
          onChange={e => {
            setSortBy(e.target.value)
            setPage(1)
          }}
        >
          {sortByOptions.map(opt => (
            <option key={opt.id} value={opt.value}>
              {opt.displayText}
            </option>
          ))}
        </select>
      </div>

      {/* Restaurants */}
      {loadingRestaurants ? (
        <div data-testid="restaurants-list-loader">Loading restaurants...</div>
      ) : (
        <div className="restaurants-grid">
          {restaurants.map(item => (
            <Link to={`/restaurant/${item.id}`} key={item.id}>
              <div className="restaurant-item" data-testid="restaurant-item">
                <img src={item.image_url} alt="restaurant" />
                <h4>{item.name}</h4>
                <p>{item.cuisine}</p>
                <p>{item.user_rating?.rating}</p>
                <p>{item.user_rating?.total_reviews} ratings</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="pagination-block">
        <button
          data-testid="pagination-left-button"
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          &lt;
        </button>

        <span data-testid="active-page-number">{page}</span>

        <button
          data-testid="pagination-right-button"
          onClick={() => setPage(p => p + 1)}
          disabled={page === totalPages}
        >
          &gt;
        </button>
      </div>

      <Footer />
    </div>
  )
}

export default RestaurantDetails
