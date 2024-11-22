import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from "react-redux";
import store from './store';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import { positions, transitions, Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";


const options = {
  timeout: 5000,
  position: positions.BOTTOM_CENTER,
  transition: transitions.SCALE
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <AlertProvider template={AlertTemplate} {...options}>
      <Elements stripe={loadStripe(process.env.REACT_APP_STRIPE_API_KEY)}>
        <App />
      </Elements>

    </AlertProvider>
  </Provider>
);

