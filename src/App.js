import React from 'react'
import './App.css'
import {LoginComponent} from './components/LoginComponent/LoginComponent'
import {Home} from './components/HomeComponent/Home'
import ProtectedRoute from './components/ProtectedComponent/ProtectedRoute'
import {Switch, Route} from 'react-router-dom'
import Cart from './components/Cart/Cart'
import PageNotFound from './components/NotFound/NotFound'
import RestaurantDetail from './components/RestaurantDetail/RestaurantDetail'
import {CartProvider} from './context/CartContext'

function App() {
  return (
    <CartProvider>
      <div className="App">
        <Switch>
          {/* Public route */}
          <Route exact path="/login" component={LoginComponent} />

          {/* Protected routes */}
          <ProtectedRoute exact path="/" component={Home} />
          <ProtectedRoute exact path="/cart" component={Cart} />
          <ProtectedRoute
            exact
            path="/restaurants/:restaurantId"
            component={RestaurantDetail}
          />

          {/* 404 fallback */}
          <Route component={PageNotFound} />
        </Switch>
      </div>
    </CartProvider>
  )
}

export default App
