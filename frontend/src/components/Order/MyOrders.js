import React, { Fragment, useEffect } from 'react';
import "./MyOrders.css";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from 'react-redux';
import { myOrders, clearErrors } from '../../actions/orderAction';
import Loader from '../layout/Loader/Loader';
import { Link } from 'react-router-dom';
import { Typography } from '@material-ui/core';
import { useAlert } from 'react-alert';
import MetaData from '../layout/MetaData';
import LaunchIcon from "@material-ui/icons/Launch";


const MyOrders = () => {
    const dispatch = useDispatch();
    const alert = useAlert();

    const { loading, error, orders } = useSelector(state => state.myOrdersReducer);
    const { user } = useSelector(state => state.userReducer);

    const columns = [
        { field: "id", headerName: "Order Id", minWidth: 300, flex: 1 },
        {
            field: "status", headerName: "Status", minWidth: 150, flex: 0.5,
            cellClassName: (params) => {
                return params.row.status === "Delivered" ? "greenColor" : "redColor"
            }
        },
        { field: "itemsQty", headerName: "Items Qty", type: "number", minWidth: 150, flex: 0.3 },
        { field: "amount", headerName: "Amount", type: "number", minWidth: 270, flex: 0.5 },
        {
            field: "actions", headerName: "Actions", type: "number", minWidth: 150, flex: 0.3, sortable: false,

            renderCell: (params) => {
                return (
                    <Link to={`/order/${params.row.id}`}>
                        <LaunchIcon />
                    </Link>
                )
            }
        }
    ];

    const rows = [];

    orders && orders.forEach((item, index) => {
        rows.push({
            id: item._id,
            amount: item.totalPrice,
            status: item.orderStatus,
            itemsQty: item.orderItems.length
        });
    });


    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }
        dispatch(myOrders());
    }, [alert, error, dispatch]);

    return (
        <Fragment>
            <MetaData title={`${user.name} - orders`} />
            {loading ? (<Loader />)
                :
                (
                    <div className='myOrdersPage'>

                        <DataGrid
                            rows={rows}
                            columns={columns}
                            pageSize={10}
                            disableSelectionOnClick
                            className='myOrdersTable'
                            autoHeight
                        />
                        <Typography className='myOrdersHeading'>{user.name}'s Orders</Typography>

                    </div>
                )}

        </Fragment>
    )
}

export default MyOrders
