import React, { Fragment, useEffect, useRef } from 'react';
import CheckoutSteps from './CheckoutSteps';
import { useDispatch, useSelector } from 'react-redux';
import MetaData from '../layout/MetaData';
import { Typography } from '@material-ui/core';
import { useAlert } from 'react-alert';
import {
    CardNumberElement,
    CardCvcElement,
    CardExpiryElement,
    useStripe,
    useElements
} from "@stripe/react-stripe-js"
import axios from 'axios';
import CreditCardIcon from "@material-ui/icons/CreditCard"
import EventIcon from "@material-ui/icons/Event"
import VpnKeyIcon from "@material-ui/icons/VpnKey"
import "./payment.css";
import { useNavigate } from "react-router-dom"
import { clearErrors, createOrder } from "../../actions/orderAction";


const Payment = () => {

    const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const stripe = useStripe();
    const elements = useElements();
    const alert = useAlert();

    const payBtn = useRef(null);

    const { shippingInfo, cartItems } = useSelector(state => state.cartReducer);
    const { user } = useSelector(state => state.userReducer);
    const { error } = useSelector(state => state.newOrderReducer);

    const paymentData = {
        amount: Math.round(orderInfo.totalPrice * 100),
    }

    const order = {
        shippingInfo,
        orderItems: cartItems,
        itemsPrice: orderInfo.subtotal,
        taxPrice: orderInfo.tax,
        shippingPrice: orderInfo.shippingCharges,
        totalPrice: orderInfo.totalPrice
    }

    const submitHandler = async (e) => {

        e.preventDefault();
        payBtn.current.disabled = true;
        try {
            const config = {
                headers: {
                    "Contenet-Type": "application/json"
                }
            };

            const { data } = await axios.post(`/api/v1/payment/process`, paymentData, config);
            console.log("data-->", data);
            const client_secret = data.client_secret;
            if (!stripe || !elements) return;

            const result = await stripe.confirmCardPayment(client_secret, {
                payment_method: {
                    card: elements.getElement(CardNumberElement),
                    billing_details: {
                        name: user.name,
                        email: user.email,
                        address: {
                            line1: shippingInfo.address,
                            city: shippingInfo.city,
                            state: shippingInfo.state,
                            postal_code: shippingInfo.pinCode,
                            country: shippingInfo.country,
                        },
                    }
                }
            });

            if (result.error) {
                console.log("error-->", result.error.message);
                payBtn.current.disabled = false;
                alert.error(result.error.message);
            } else {
                if (result.paymentIntent.status === "succeeded") {
                    order.paymentInfo = {
                        id: result.paymentIntent.id,
                        status: result.paymentIntent.status,
                    };
                    dispatch(createOrder(order));
                    navigate("/succcess");
                } else {
                    alert.error("There's some issue while processing payment");
                }
            }

        } catch (error) {
            payBtn.current.disabled = false;
            alert.error(error.response.data.message);
        }

    }


    useEffect(() => {

        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

    }, [error, alert, dispatch]);


    return (
        <>
            {process.env.REACT_APP_STRIPE_API_KEY &&

                <Fragment>

                    <MetaData title={"Payment"} />
                    <CheckoutSteps activeStep={2} />

                    <div className='paymentContainer'>
                        <form className='paymentForm' onSubmit={(e) => submitHandler(e)}>
                            <Typography>Card Info</Typography>
                            <div>
                                <CreditCardIcon />
                                <CardNumberElement className='paymentInput' />
                            </div>
                            <div>
                                <EventIcon />
                                <CardExpiryElement className='paymentInput' />
                            </div>
                            <div>
                                <VpnKeyIcon />
                                <CardCvcElement className='paymentInput' />
                            </div>

                            <input
                                type="submit"
                                value={`Pay - ₹${orderInfo && orderInfo.totalPrice}`}
                                ref={payBtn}
                                className='paymentFormBtn'
                            />

                        </form>
                    </div>

                </Fragment>
            }
        </>
    )
}

export default Payment
