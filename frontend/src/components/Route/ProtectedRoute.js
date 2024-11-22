import React from 'react'
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ isAdmin, Component, isAuthenticated, ...rest }) => {

    const { user, loading } = useSelector(state => state.userReducer);



    if (loading === false) {

        if (isAuthenticated === false) {
            return <Navigate to="/login" />;
        }
        else {
            if (isAdmin === true && user.role !== "admin") {
                return <Navigate to="/account" />;
            }
            return <Component {...rest} />
        }
    }

}

export default ProtectedRoute;
