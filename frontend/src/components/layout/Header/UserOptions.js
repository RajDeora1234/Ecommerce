import React, { Fragment, useState } from 'react';
import "./Header.css";
import { SpeedDial, SpeedDialAction } from '@material-ui/lab';
import { Backdrop } from '@material-ui/core';
import DashboardIcon from "@material-ui/icons/Dashboard";
import PersonIcon from "@material-ui/icons/Person"
import ExitToAppIcon from "@material-ui/icons/ExitToApp"
import ListAltIcon from "@material-ui/icons/ListAlt"
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useAlert } from 'react-alert';
import { logout } from '../../../actions/userAction';
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart"



const UserOptions = ({ user }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const alert = useAlert();
    const [open, setOpen] = useState(false);
    const { cartItems } = useSelector(state => state.cartReducer);

    const orders = () => {
        navigate("/orders");
    }
    const account = () => {
        navigate("/account");
    }
    const logoutUser = () => {
        dispatch(logout());
        alert.success("Logout Successfully");

    }
    const dashboard = () => {
        navigate("/admin/dashboard");
    }
    const cart = () => {
        navigate('/cart');
    }


    const options = [
        { icon: <ListAltIcon />, name: "Orders", func: orders },
        { icon: <PersonIcon />, name: "Profile", func: account },
        { icon: <ShoppingCartIcon style={{ color: cartItems.length > 0 ? "tomato" : "unset" }} />, name: `Cart(${cartItems.length})`, func: cart },
        { icon: <ExitToAppIcon />, name: "Logout", func: logoutUser }
    ]
    if (user.role === 'admin') {
        options.unshift({ icon: <DashboardIcon />, name: "Dashboard", func: dashboard })
    }

    return (
        <Fragment>
            <Backdrop open={open} style={{ zIndex: "10" }} />
            <SpeedDial
                ariaLabel="User options"
                onClose={() => setOpen(false)}
                onOpen={() => setOpen(true)}
                open={open}
                style={{ zIndex: "11" }}
                direction='down'
                className='speedDial'
                icon={
                    <img
                        className='speedDialIcon'
                        src={user.avatar.url ? user.avatar.url : "/Profile.png"}
                        alt='Profile'
                    />
                }

            >
                {options.map((item, index) => (
                    <SpeedDialAction
                        key={item.name}
                        icon={item.icon}
                        tooltipTitle={item.name}
                        onClick={item.func}
                        tooltipOpen={window.innerWidth <= 600 ? true : false}
                    />
                ))}
            </SpeedDial>
        </Fragment>
    )
}

export default UserOptions;
