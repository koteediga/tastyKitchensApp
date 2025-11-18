
import React from "react";
import Header from "../Header/Header";
import {Footer} from "../Footer/Footer";
import { Navigate } from "react-router-dom";

const PaymentSucess=()=>
{
    const navigate=Navigate;
    return (
        <div>
            <div>
                <Header/>
            </div>

          <div>
            <h1 style={{textAlign:"center",marginTop:"50px"}}>Payment Successful!</h1>
            <p>Thank you for ordering </p>
            <p>Your payment is successful completed</p>
            <button onClick={()=>navigate("/")}>Go To Home Page</button>
          </div>

            <div>
                <Footer/>

            </div>
        </div>
    )
}

export default PaymentSucess;