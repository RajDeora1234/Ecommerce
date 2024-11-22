import React, { Fragment, useEffect } from 'react'
import { CgMouse } from "react-icons/cg"
import "./Home.css";
import Product from "./ProductCard";
import MetaData from '../layout/MetaData';
import { clearErrors, getProducts } from "../../actions/productAction";
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../layout/Loader/Loader';
import { useAlert } from 'react-alert';

const Home = () => {
    const alert = useAlert();
    const dispatch = useDispatch();
    const { loading, error, products } = useSelector(state => state.productReducer);

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }
        dispatch(getProducts());

    }, [dispatch, error, alert]);

    return (
        <Fragment>
            {loading ? <Loader /> : <Fragment>
                <MetaData title={"ECOMMERCE"} />
                <div className='banner'>
                    <p>Welcome to Ecommerce</p>
                    <h1>FIND AMAZING PRODUCTS BELOW </h1>

                    <a href="#container">
                        <button>
                            scroll<CgMouse />
                        </button>
                    </a>
                </div>
                <h2 className='homeHeading'>Featured Products</h2>

                <div id='container' className='container'>
                    {products && products.map((product) => (<Product product={product} />))}

                </div>
            </Fragment>}
        </Fragment>
    )
}

export default Home
