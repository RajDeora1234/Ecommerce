import React, { Fragment, useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import "./ProductReviews.css"
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors, getAllReviews, deleteReview } from '../../actions/productAction';
import { useAlert } from 'react-alert';
import { Button } from '@material-ui/core';
import MetaData from '../layout/MetaData';
import DeleteIcon from "@material-ui/icons/Delete"
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';
import { DELETE_REVIEW_RESET } from '../../constants/productConstants';
import Star from "@material-ui/icons/Star"

const ProductReviews = () => {
    const dispatch = useDispatch();
    const alert = useAlert();
    const navigate = useNavigate();

    const { error: deleteError, isDeleted } = useSelector(state => state.reviewReducer);
    const { error, reviews, loading } = useSelector(state => state.productReviewsReducer);

    const [productId, setProductId] = useState("");


    useEffect(() => {
        if (productId.length === 24) {
            dispatch(getAllReviews(productId));
        }
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }
        if (deleteError) {
            alert.error(deleteError);
            dispatch(clearErrors());
        }
        if (isDeleted) {
            alert.success("Review Deleted Successfully");
            navigate('/admin/reviews');
            dispatch({ type: DELETE_REVIEW_RESET });
        }
    }, [error, alert, dispatch, deleteError, navigate, isDeleted, productId]);


    const deleteReviewHandler = (reviewId) => {
        dispatch(deleteReview(reviewId, productId));
    }

    const productReviewsSubmitHandler = (e) => {
        e.preventDefault();
        dispatch(getAllReviews(productId));
    }

    const columns = [
        { field: "id", headerName: "Review ID", minWidth: 200, flex: 0.5 },

        {
            field: "user",
            headerName: 'User',
            minWidth: 250,
            flex: 0.6,
        },
        {
            field: "comment",
            headerName: "Comment",
            minWidth: 350,
            flex: 1
        },

        {
            field: "rating",
            headerName: "Rating",
            type: "number",
            minWidth: 50,
            flex: 0.2,
            cellClassName: (params) => {
                return params.row.rating >= 3 ? "greenColor" : "redColor"
            }
        },
        {
            field: "actions",
            headerName: "Actions",
            minWidth: 100,
            flex: 0.2,
            type: "number",
            sortable: false,
            renderCell: (params) => {
                return (
                    <Fragment>

                        <Button onClick={() => deleteReviewHandler(params.row.id)}>
                            <DeleteIcon />
                        </Button>
                    </Fragment>
                )
            }
        }
    ];

    const rows = [];

    reviews &&
        reviews.forEach((item) => {
            rows.push({
                id: item._id,
                rating: item.rating,
                comment: item.comment,
                user: item.name,
            })
        });


    return (
        <Fragment>
            <MetaData title={"ALL REVIEWS --Admin"} />
            <div className='dashboard'>
                <Sidebar />
                <div className='productReviewsContainer'>
                    <form
                        className='productReviewsForm'
                        encType='multipart/form-data'
                        onSubmit={productReviewsSubmitHandler}
                    >
                        <h1 className='productReviewsFormHeading'>ALL REVIEWS</h1>
                        <div>
                            <Star />
                            <input
                                type="text"
                                placeholder='Product ID'
                                required
                                value={productId}
                                onChange={(e) => setProductId(e.target.value)}
                            />
                        </div>
                        <Button
                            id='createProductBtn'
                            type='submit'
                            disabled={loading ? true : false || productId === "" ? true : false}
                        >
                            Search
                        </Button>
                    </form>
                    {reviews && reviews.length > 0 ?
                        <DataGrid
                            columns={columns}
                            rows={rows}
                            pageSize={10}
                            disableSelectionOnClick
                            className='productListTable'
                            autoHeight
                        />
                        :
                        <h1 className='productReviewsFormHeading'> No Reviews Found</h1>
                    }
                </div>

            </div>

        </Fragment>
    )
}


export default ProductReviews
