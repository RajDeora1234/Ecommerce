import React, { Fragment, useEffect, useState } from 'react';
import "./Products.css";
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors, getProducts } from '../../actions/productAction';
import Loader from '../layout/Loader/Loader';
import ProductCard from '../Home/ProductCard';
import { useAlert } from 'react-alert';
import { useParams } from 'react-router-dom';
import Pagination from "react-js-pagination";
import Slider from "@material-ui/core/Slider";
import { Typography } from '@material-ui/core';
import MetaData from '../layout/MetaData';


const Products = () => {

    const categories = [
        "Laptop",
        "Footwear",
        "Bottom",
        "Tops",
        "Attire",
        "Camera",
        "SmartPhones",
    ]

    const [currentPage, setCurrentPage] = useState(1);
    const [price, setPrice] = useState([0, 25000]);
    const [category, setCategory] = useState("");
    const [ratings, setRatings] = useState(0);

    const params = useParams();
    const alert = useAlert();
    const dispatch = useDispatch();
    const { loading, error, products, productsCount, resultPerPage } = useSelector(state => state.productReducer);
    const keyword = params.keyword;

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }
        dispatch(getProducts(keyword, currentPage, price, category, ratings));
    }, [dispatch, alert, error, keyword, currentPage, price, category, ratings])

    const priceHandler = (event, newPrice) => {
        setPrice(newPrice);
    }

    const setCurrentPageNo = (e) => {
        setCurrentPage(e);
    }

    return (
        <Fragment>
            {loading ? <Loader />
                :
                <Fragment>
                    <MetaData title={"PRODUCTS -- ECOOMERCE"} />
                    <h2 className='productsHeading'>Products</h2>
                    <div className='products'>
                        {products &&
                            products.map((product) => (<ProductCard key={product._id} product={product} />))
                        }
                    </div>

                    <div className='filterBox'>
                        <Typography>Price</Typography>
                        <Slider

                            value={price}
                            onChange={priceHandler}
                            valueLabelDisplay='auto'
                            aria-labelledby='range-slider'
                            min={0}
                            max={25000}
                        />

                        <Typography>Categories</Typography>
                        <ul className='categoryBox'>
                            {categories.map((category) => (
                                <li
                                    className='category-link'
                                    key={category}
                                    onClick={() => setCategory(category)}
                                >
                                    {category}
                                </li>
                            ))}
                        </ul>
                        <fieldset>
                            <Typography className='legend'>Ratings Above</Typography>
                            <Slider
                                value={ratings}
                                onChange={(e, newRating) => {
                                    setRatings(newRating);
                                }}
                                aria-labelledby='continuous-slider'
                                min={0}
                                max={5}
                                valueLabelDisplay='auto'
                            />
                        </fieldset>

                    </div>
                    {resultPerPage < productsCount &&
                        <div className='paginationBox'>
                            <Pagination
                                activePage={currentPage}
                                itemsCountPerPage={resultPerPage}
                                totalItemsCount={productsCount}
                                onChange={setCurrentPageNo}
                                nextPageText={"Next"}
                                prevPageText={"Prev"}
                                firstPageText={"1st"}
                                lastPageText={"Last"}
                                itemClass='page-item'
                                linkClass='page-link'
                                activeClass='pageItemActive'
                                activeLinkClass='pageLinkActive'
                            />
                        </div>
                    }

                </Fragment>}
        </Fragment>
    )
}

export default Products
