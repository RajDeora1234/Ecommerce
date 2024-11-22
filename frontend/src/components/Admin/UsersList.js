import React, { Fragment, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import "./ProductList.css"
import { useDispatch, useSelector } from 'react-redux';
import { useAlert } from 'react-alert';
import { Link } from 'react-router-dom';
import { Button } from '@material-ui/core';
import MetaData from '../layout/MetaData';
import EditIcon from "@material-ui/icons/Edit"
import DeleteIcon from "@material-ui/icons/Delete"
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';
import { getAllUsers, clearErrors, deleteUser } from '../../actions/userAction';
import { DELETE_USER_RESET } from '../../constants/userConstants';

const UsersList = () => {
    const dispatch = useDispatch();
    const alert = useAlert();
    const navigate = useNavigate();
    const { error, users } = useSelector(state => state.allUsersReducer);

    const {
        error: deleteError,
        isDeleted,
        message
    } = useSelector(state => state.profileReducer);

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }
        if (deleteError) {
            alert.error(deleteError);
            dispatch(clearErrors());
        }
        if (isDeleted) {
            alert.success(message);
            navigate('/admin/users');
            dispatch({ type: DELETE_USER_RESET });
        }
        dispatch(getAllUsers());
    }, [error, alert, dispatch, deleteError, navigate, isDeleted, message]);


    const deleteUserHandler = (id) => {
        dispatch(deleteUser(id));
    }

    const columns = [
        { field: "id", headerName: "User ID", minWidth: 200, flex: 0.8 },
        {
            field: "email",
            headerName: "Email",
            minWidth: 350,
            flex: 1
        },
        {
            field: "name",
            headerName: 'Name',
            minWidth: 150,
            flex: 0.5,
        },
        {
            field: "role",
            headerName: "Role",
            minWidth: 270,
            flex: 0.3,
            cellClassName: (params) => {
                return params.row.role === "admin" ? "greenColor" : "redColor"
            }
        },
        {
            field: "actions",
            headerName: "Actions",
            minWidth: 150,
            flex: 0.3,
            type: "number",
            sortable: false,
            renderCell: (params) => {
                return (
                    <Fragment>
                        <Link to={`/admin/user/${params.row.id}`}>
                            <EditIcon />
                        </Link>
                        <Button onClick={() => deleteUserHandler(params.row.id)}>
                            <DeleteIcon />
                        </Button>
                    </Fragment>
                )
            }
        }
    ];

    const rows = [];

    users &&
        users.forEach((item) => {
            rows.push({
                id: item._id,
                email: item.email,
                name: item.name,
                role: item.role,
            })
        });


    return (
        <Fragment>
            <MetaData title={"ALL USERS --Admin"} />
            <div className='dashboard'>
                <Sidebar />
                <div className='productListContainer'>
                    <h1 id='productListHeading'>ALL USERS</h1>
                    <DataGrid
                        columns={columns}
                        rows={rows}
                        pageSize={10}
                        rowsPerPageOptions={[5, 10, 15]}
                        disableSelectionOnClick
                        className='productListTable'
                        autoHeight
                    />
                </div>

            </div>

        </Fragment>
    )
}


export default UsersList;
