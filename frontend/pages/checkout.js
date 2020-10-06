import React, { useContext } from 'react';

import { Row, Col } from 'reactstrap';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import InjectedCheckoutForm from '../components/checkout/CheckoutForm';
import AppContext from '../context/AppContext';

import Cart from '../components/cart/Cart';

const STRIPE_API_KEY = process.env.NEXT_PUBLIC_STRIPE_API_KEY;

function Checkout() {
  const appContext = useContext(AppContext);
  const { isAuthenticated } = appContext;
  const stripePromise = loadStripe(STRIPE_API_KEY);

  return (
    <Row>
      <Col style={{ paddingRight: 0 }} sm={{ size: 3, order: 1, offset: 2 }}>
        <h1 style={{ margin: 20 }}>Checkout</h1>
        <Cart isAuthenticated={isAuthenticated} />
      </Col>
      <Col style={{ paddingLeft: 5 }} sm={{ size: 6, order: 2 }}>
        <Elements stripe={stripePromise}>
          <InjectedCheckoutForm />
        </Elements>
      </Col>
    </Row>
  );
}
export default Checkout;
