//import {Link} from "react-router-dom"
import { Header } from "../Header/Header";
import {Footer} from "../Footer/Footer"
import { RestaurantDetails } from "../RestaurantDetails/RestaurantDetails";


export const Home = () => {
  return (
  <div><Header/>
  <div>
    {/* <img src="https://res.cloudinary.com/dh8jgl2ue/image/upload/v1759597556/Frame_7_trleds.png" alt="home page"/> */}
  </div>
  <div>
   <RestaurantDetails/>
  </div>
  
    <Footer/>
  
  </div>

)};
