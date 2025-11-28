import {Switch, Route, Redirect} from 'react-router-dom'
import ProtectedRoute from './components/ProtectedComponent/ProtectedRoute'
import LoginComponent from './components/LoginComponent/LoginComponent'
import Home from './components/HomeComponent/Home'
import RestaurantDetail from './components/RestaurantDetail/RestaurantDetail'
import Cart from './components/Cart/Cart'
import NotFound from './components/NotFound/NotFound'

import './App.css'

const App = () => (
  <Switch>
    {/* LOGIN ROUTE */}
    <Route exact path="/login" component={LoginComponent} />

    {/* HOME ROUTE (PROTECTED) */}
    <ProtectedRoute exact path="/" component={Home} />

    {/* RESTAURANT DETAILS ROUTE (PROTECTED) */}
    <ProtectedRoute exact path="/restaurant/:id" component={RestaurantDetail} />

    {/* CART ROUTE (PROTECTED) */}
    <ProtectedRoute exact path="/cart" component={Cart} />

    {/* NOT FOUND ROUTE */}
    <Route path="/not-found" component={NotFound} />

    {/* INVALID URL REDIRECT */}
    <Redirect to="/not-found" />
  </Switch>
)

export default App
