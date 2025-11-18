import { useState, useEffect } from "react";
import "./RestaurantDetails.css";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import {Footer} from "../Footer/Footer"
// import Header from "../Header/Header";

const sortByOptions = [
  { id: 'Lowest', label: 'Sort by Lowest' },
  { id: 'Highest', label: 'Sort by Highest' },
];

const RESTAURANTS_LIMIT = 9;

const jwtToken = Cookies.get("jwt_token");

const requestOptions = {
  headers: {
    Authorization: `Bearer ${jwtToken}`,
  },
};

export const RestaurantDetails = () => {
  const [loadingOffers, setLoadingOffers] = useState(false);
  const [carouselOffers, setCarouselOffers] = useState([]);
  const [activeCarousel, setActiveCarousel] = useState(0);

  const [loadingRestaurants, setLoadingRestaurants] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const [sortBy, setSortBy] = useState('Lowest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // Fetch offers for carousel
  useEffect(() => {
    async function fetchOffers() {
      setLoadingOffers(true);
      try {
        const res = await fetch('https://apis.ccbp.in/restaurants-list/offers', requestOptions);
        const data = await res.json();
        setCarouselOffers(data.offers || []);
      } catch (err) {
        console.error('Failed to fetch offers:', err);
      }
      setLoadingOffers(false);
    }
    fetchOffers();
  }, []);

  // Fetch restaurants on page or sortBy change
  useEffect(() => {
    async function fetchRestaurants() {
      setLoadingRestaurants(true);
      const offset = (page - 1) * RESTAURANTS_LIMIT;
      const url = `https://apis.ccbp.in/restaurants-list?offset=${offset}&limit=${RESTAURANTS_LIMIT}&sort_by_rating=${sortBy}`;
      try {
        const res = await fetch(url, requestOptions);
        const data = await res.json();
        console.log(data);
        setRestaurants(data.restaurants || []);
        setTotalPages(Math.ceil((data.total || 180) / RESTAURANTS_LIMIT));
      } catch (err) {
        console.error('Failed to fetch restaurants:', err);
      }
      setLoadingRestaurants(false);
    }
    fetchRestaurants();
  }, [sortBy, page]);

  // Carousel navigation
  const nextSlide = () => {
    setActiveCarousel((prev) => (prev + 1) % carouselOffers.length);
  };

  const prevSlide = () => {
    setActiveCarousel((prev) => (prev - 1 + carouselOffers.length) % carouselOffers.length);
  };

  const setSlide = (index) => {
    setActiveCarousel(index);
  };

  return (
    <div>
      {/* <div>
            <Header />
          </div> */}
    
    <div className="home-container">
      <h2>Popular Restaurants</h2>
      <p>Select Your favourite restaurant special dish and make your day happy...</p>

      {/* Carousel */}
      <div className="carousel-block-flex">
        {loadingOffers ? (
          <div data-testid="restaurants-offers-loader">Loading offers...</div>
        ) : (
          carouselOffers.length > 0 && (
            <div className="carousel-wrapper">
              <button className="carousel-arrow" onClick={prevSlide}>&lt;</button>
              <img
                src={carouselOffers[activeCarousel].image_url}
                alt="offer"
                className="carousel-image-main"
              />
              <button className="carousel-arrow" onClick={nextSlide}>&gt;</button>

              <div className="carousel-dots">
                {carouselOffers.map((_, idx) => (
                  <button
                    key={idx}
                    className={`carousel-dot${activeCarousel === idx ? " active" : ""}`}
                    onClick={() => setSlide(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          )
        )}
      </div>

      {/* Sort filter */}
      <div className="sortby-block">
        <label htmlFor="sortby">Sort by:</label>
        <select
          id="sortby"
          value={sortBy}
          onChange={e => {
            setSortBy(e.target.value);
            setPage(1);
          }}
        >
          {sortByOptions.map(opt => (
            <option key={opt.id} value={opt.id}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Restaurants Grid */}
      <div className="restaurants-block">
        {loadingRestaurants ? (
          <div data-testid="restaurants-list-loader">Loading restaurants...</div>
        ) : (
          <div className="restaurants-grid">
            {restaurants.map(item => (
                  <Link to={`/restaurants/${item.id}`} key={item.id}>
              <div key={item.id} className="restaurant-item" data-testid="restaurant-item">
                <img src={item.image_url} alt="restaurant" className="rest-image" />
                <h4>{item.name}</h4>
                <p>{item.cuisine}</p>
                <div className="rest-rating">
                  <span style={{ color: '#fbbf24', fontSize: '18px' }}>★</span>
                  <span>{item.user_rating.rating}</span>
                  <span>({item.user_rating.total_reviews} ratings)</span>
                </div>
              </div></Link>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="pagination-block">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          data-testid="pagination-left-button"
        >
          &lt;
        </button>
        <span data-testid="active-page-number">{page}</span> of {totalPages}
        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
          data-testid="pagination-right-button"
        >
          &gt;
        </button>
      </div>
      <div>
            <Footer />
          </div>
    </div>
    </div>
  );
};
