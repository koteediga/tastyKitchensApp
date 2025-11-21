import {Switch, Route} from 'react-router-dom'
import './App.css'

import {LoginComponent} from './components/LoginComponent/LoginComponent'
import {Home} from './components/HomeComponent/Home'
import ProtectedRoute from './components/ProtectedComponent/ProtectedRoute'
import Cart from './components/Cart/Cart'
import PageNotFound from './components/NotFound/NotFound'
import RestaurantDetail from './components/RestaurantDetail/RestaurantDetail'
import PaymentSucess from './components/PaymentSucess/PaymentSucess'

import {CartProvider} from './context/CartContext'

function App() {
  return (
    <CartProvider>
      <Switch>
        {/* LOGIN */}
        <Route exact path="/login" component={LoginComponent} />

        {/* HOME ROUTE (Protected by ProtectedRoute) */}
        <ProtectedRoute exact path="/" component={Home} />

        {/* ⚠️ DO NOT USE ProtectedRoute HERE  
            CCbp requires authentication check INSIDE the component */}
        <Route exact path="/restaurant/:id" component={RestaurantDetail} />

        {/* ⚠️ SAME: Cart must NOT use ProtectedRoute */}
        <Route exact path="/cart" component={Cart} />

        {/* OPTIONAL PROTECTED ROUTE */}
        <ProtectedRoute
          exact
          path="/payment-success"
          component={PaymentSucess}
        />

        {/* 404 */}
        <Route component={PageNotFound} />
      </Switch>
    </CartProvider>
  )
}

export default App
