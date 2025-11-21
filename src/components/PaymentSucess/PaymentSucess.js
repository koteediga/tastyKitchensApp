import React from 'react'
import {useHistory} from 'react-router-dom'
import {Header} from '../Header/Header'
import {Footer} from '../Footer/Footer'

const PaymentSucess = () => {
  const history = useHistory()
  return (
    <div>
      <Header />
      <div style={{textAlign: 'center', marginTop: '50px'}}>
        <h1>Payment Successful!</h1>
        <p>Thank you for ordering</p>
        <p>Your payment is successfully completed</p>
        <button onClick={() => history.push('/')}>Go To Home Page</button>
      </div>
      <Footer />
    </div>
  )
}

export default PaymentSucess
