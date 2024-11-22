import React, { Fragment } from 'react';
import "./Cart.css";
import CartItemCard from "./CartItemCard.js";
import { useDispatch, useSelector } from "react-redux";
import { addItemsToCart, removeItemFromCart } from "../../actions/cartAction.js"
import RemoveShoppingCartIcon from "@material-ui/icons/RemoveShoppingCart";
import { Typography } from '@material-ui/core';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { cartItems } = useSelector(state => state.cartReducer);

    const increaseQuantity = (id, quantity, stock) => {
        const newQty = quantity + 1;
        if (stock <= quantity) {
            return;
        }
        dispatch(addItemsToCart(id, newQty));
    }
    const decreaseQuantity = (id, quantity) => {
        const newQty = quantity - 1;
        if (quantity <= 1) {
            return;
        }
        dispatch(addItemsToCart(id, newQty));
    }

    const deleteItemFromCart = (id) => {
        dispatch(removeItemFromCart(id));
    }

    const checkoutHandler = () => {
        navigate("/login?redirect=shipping");
    }


    return (
        <Fragment>
            {cartItems.length === 0 ?
                <div className='emptyCart'>
                    <RemoveShoppingCartIcon />
                    <Typography>No Product in Your Cart</Typography>
                    <Link to={`/products`}>View Products</Link>
                </div>
                :
                <Fragment>
                    <div className='cartPage'>
                        <div className='cartHeader'>
                            <p>Product</p>
                            <p>Quantity</p>
                            <p>Subtotal</p>
                        </div>

                        {cartItems && cartItems.map((item, index) => (
                            <div className='cartContainer' key={item.product}>
                                <CartItemCard item={item} deleteItemFromCart={deleteItemFromCart} />
                                <div className='cartInput'>
                                    <button onClick={() => decreaseQuantity(item.product, item.quantity)} >-</button>
                                    <input type="number" value={item.quantity} readOnly />
                                    <button onClick={() => increaseQuantity(item.product, item.quantity, item.stock)}>+</button>
                                </div>
                                <p className='cartSubtotal'>{`₹${item.price * item.quantity}`}</p>

                            </div>
                        ))}

                        <div className='cartGrossTotal'>
                            <div></div>
                            <div className='cartGrossTotalBox'>
                                <p>Gross Total</p>
                                <p>{`₹${cartItems.reduce(
                                    (acc, item) => acc + item.price * item.quantity,
                                    0
                                )}`}</p>
                            </div>
                            <div></div>
                            <div className='checkOutBtn'>
                                <button onClick={checkoutHandler}>Check Out</button>
                            </div>
                        </div>

                    </div>

                </Fragment>
            }
        </Fragment>
    )
}

export default Cart
