import React, { useEffect } from 'react';
import Sidebar from "./Sidebar.js";
import "./Dashboard.css";
import { Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { Doughnut, Line } from "react-chartjs-2"
import {
    Chart as ChartJS,
    CategoryScale,
    ArcElement,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
} from "chart.js";
import { useSelector, useDispatch } from 'react-redux';
import { getAdminProduct } from '../../actions/productAction.js';
import { getAllOrders } from '../../actions/orderAction.js';
import { getAllUsers } from '../../actions/userAction.js';

const Dashboard = () => {
    // Register Chart.js components
    ChartJS.register(
        CategoryScale,
        ArcElement,
        LinearScale,
        PointElement,
        LineElement,
        Tooltip,
        Legend
    );
    const dispatch = useDispatch();
    const { products } = useSelector(state => state.productReducer);
    const { orders } = useSelector(state => state.allOrdersReducer);
    const { users } = useSelector(state => state.allUsersReducer);

    let outOfStock = 0;

    let totalAmount = 0;

    orders &&
        orders.forEach(item => {
            totalAmount += item.totalPrice;
        })

    products && products.forEach((item) => {
        if (item.stock === 0) {
            outOfStock += 1;
        }
    });

    useEffect(() => {
        dispatch(getAdminProduct());
        dispatch(getAllOrders());
        dispatch(getAllUsers());
    }, [dispatch]);


    const lineState = {

        labels: ["Initial Amount", "Amount Earned"],
        datasets: [
            {
                label: "TOTAL AMOUNT",
                backgroundColor: ["tomato"],
                hoverBackgroundColor: ["rgb(197, 72, 49)"],
                data: [0, totalAmount],
            }
        ]
    }
    const doughnutState = {

        labels: ["out of Stock", "InStock"],
        datasets: [
            {
                backgroundColor: ["#00A6B4", "#6800B4"],
                hoverBackgroundColor: ["#4B5000", "#35014F"],
                data: [outOfStock, products.length - outOfStock],
            }
        ]
    }

    return (
        <div className='dashboard'>
            <Sidebar />
            <div className='dashboardContainer'>

                <Typography component={"h1"}>Dashboard</Typography>
                <div className='dashboardSummary'>
                    <div>
                        <p>
                            Total Amount <br /> ₹{totalAmount}
                        </p>
                    </div>
                    <div className='dashboardSummaryBox2'>
                        <Link to={`/admin/products`}>
                            <p>Products</p>
                            <p>{products && products.length}</p>
                        </Link>
                        <Link to={`/admin/orders`}>
                            <p>Orders</p>
                            <p>{orders && orders.length}</p>
                        </Link>
                        <Link to={`/admin/users`}>
                            <p>Users</p>
                            <p>{users && users.length}</p>
                        </Link>


                    </div>

                </div>

                <div className='lineChart'>
                    <Line data={lineState} />

                </div>
                <div className='doughnutChart'>
                    <Doughnut data={doughnutState} />

                </div>
            </div>
        </div>
    )
}

export default Dashboard
