import React, { Fragment, useEffect, useState } from 'react';
import "./ProductDetails.css";
import Carousel from "react-material-ui-carousel";
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors, getProductDetails, newReview } from '../../actions/productAction';
import { useParams } from 'react-router-dom';
import Loader from '../layout/Loader/Loader';
import ReviewCard from "./ReviewCard"
import { useAlert } from "react-alert";
import MetaData from '../layout/MetaData';
import { addItemsToCart } from '../../actions/cartAction';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button
} from "@material-ui/core"

import { Rating } from "@material-ui/lab";
import { NEW_REVIEW_RESET } from '../../constants/productConstants';


const ProductDetails = () => {
    const alert = useAlert();
    const params = useParams();
    const dispatch = useDispatch();

    const { loading, error, product } = useSelector(state => state.productDetailsReducer);
    const { success, error: reviewError } = useSelector(state => state.newReviewReducer);

    const [quantity, setQuantity] = useState(1);
    const [open, setOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");


    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }
        if (reviewError) {
            alert.error(reviewError);
            dispatch(clearErrors());
        }
        if (success) {
            alert.success("Review Submitted Successfully");
            dispatch({
                type: NEW_REVIEW_RESET
            });
        }
        dispatch(getProductDetails(params.id));
    }, [dispatch, params.id, alert, error, reviewError, success]);

    const options = {
        size: "large",
        value: product.ratings,
        readOnly: true,
        precision: 0.5,
    };
    const decreaseQuantity = () => {
        if (quantity <= 1) return;
        const qty = quantity - 1;
        setQuantity(qty);

    }
    const increaseQuantity = () => {
        if (product.stock <= quantity) return;

        const qty = quantity + 1;
        setQuantity(qty);
    }

    const addToCartHandler = () => {
        dispatch(addItemsToCart(params.id, quantity));
        alert.success("Item Added To cart");
    }

    const submitReviewToggle = () => {
        open ? setOpen(false) : setOpen(true);
    }


    const reviewSubmitHandler = () => {
        const myForm = new FormData();
        myForm.set("rating", rating);
        myForm.set("comment", comment);
        myForm.set("productId", params.id);
        dispatch(newReview(myForm));
        setOpen(false);
    }


    return (
        <Fragment>
            {loading ? <Loader /> : <Fragment>
                <MetaData title={`${product.name} -- ECOMMERCE`} />
                <div className='ProductDetails'>
                    <div>
                        <Carousel>
                            {product.images &&
                                product.images.map((item, i) => (
                                    <img
                                        className='CarouselImage'
                                        key={item.url}
                                        src={item.url}
                                        alt={`${i} Slide`} />
                                ))
                            }
                        </Carousel>
                    </div>

                    <div>
                        <div className='detailsBlock-1'>
                            <h2>{product.name}</h2>
                            <p>Product # {product._id}</p>
                        </div>
                        <div className='detailsBlock-2'>
                            <Rating {...options} />
                            <span className='detailsBlock-2-span'>({product.numOfReviews} Reviews)</span>
                        </div>
                        <div className='detailsBlock-3'>
                            <h1>{`₹${product.price}`}</h1>
                            <div className='detailsBlock-3-1'>
                                <div className='detailsBlock-3-1-1'>
                                    <button onClick={decreaseQuantity}>-</button>
                                    <input type="number" readOnly value={quantity} />
                                    <button onClick={increaseQuantity}>+</button>
                                </div>
                                <button disabled={product.stock < 1 ? true : false} onClick={addToCartHandler}>Add to Cart</button>

                            </div>
                            <p>
                                Status: <b className={product.stock < 2 ? "redColor" : "greenColor"}>{product.stock < 1 ? "OutOfStock" : "InStock"}</b>
                            </p>
                        </div>

                        <div className='detailsBlock-4'>
                            Description: <p>{product.description}</p>
                        </div>
                        <button onClick={submitReviewToggle} className='submitReview'>Submit Review</button>
                    </div>

                </div>
                <h3 className='reviewsHeading'>Reviews</h3>

                <Dialog
                    aria-labelledby='simple-dialog-title'
                    open={open}
                    onClose={submitReviewToggle}
                >
                    <DialogTitle>Submit Review</DialogTitle>
                    <DialogContent className='submitDialog'>
                        <Rating
                            onChange={(e) => setRating(e.target.value)}
                            value={rating}
                            size="large"
                        />

                        <textarea
                            className='submitDialogTextArea'
                            cols={"30"}
                            rows={"5"}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        ></textarea>
                    </DialogContent>
                    <DialogActions>
                        <Button color='secondary' onClick={submitReviewToggle}>Cancel</Button>
                        <Button color='primary' onClick={reviewSubmitHandler}>Submit</Button>
                    </DialogActions>
                </Dialog>

                {product.reviews && product.reviews[0] ? (
                    <div className='reviews'>
                        {product.reviews && product.reviews.map((review) => (<ReviewCard review={review} />))}
                    </div>
                ) : (
                    <p className='noReviews'>No Reviews Yet</p>
                )}
            </Fragment>}
        </Fragment>
    )
}

export default ProductDetails
