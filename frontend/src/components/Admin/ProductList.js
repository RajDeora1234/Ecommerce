import React, { Fragment, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import "./ProductList.css"
import { useDispatch, useSelector } from 'react-redux';
import { getAdminProduct, clearErrors, deleteProduct } from '../../actions/productAction';
import { useAlert } from 'react-alert';
import { Link } from 'react-router-dom';
import { Button } from '@material-ui/core';
import MetaData from '../layout/MetaData';
import EditIcon from "@material-ui/icons/Edit"
import DeleteIcon from "@material-ui/icons/Delete"
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';
import { DELETE_PRODUCT_RESET } from '../../constants/productConstants';

const ProductList = () => {
    const dispatch = useDispatch();
    const alert = useAlert();
    const navigate = useNavigate();
    const { error, products } = useSelector(state => state.productReducer);
    const { error: deleteError, isDeleted } = useSelector(state => state.deleteProductReducer);

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
            alert.success("Product Deleted Successfully");
            navigate('/admin/dashboard');
            dispatch({ type: DELETE_PRODUCT_RESET });
        }
        dispatch(getAdminProduct());
    }, [error, alert, dispatch, deleteError, navigate, isDeleted]);


    const deleteProductHandler = (id) => {
        dispatch(deleteProduct(id));
    }

    const columns = [
        { field: "id", headerName: "Product ID", minWidth: 200, flex: 0.5 },
        {
            field: "name",
            headerName: "Name",
            minWidth: 350,
            flex: 1
        },
        {
            field: "stock",
            headerName: 'Stock',
            minWidth: 150,
            flex: 0.3,
        },
        {
            field: "price",
            headerName: "Price",
            minWidth: 270,
            flex: 0.5,
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
                        <Link to={`/admin/product/${params.row.id}`}>
                            <EditIcon />
                        </Link>
                        <Button onClick={() => deleteProductHandler(params.row.id)}>
                            <DeleteIcon />
                        </Button>
                    </Fragment>
                )
            }
        }
    ];

    const rows = [];

    products &&
        products.forEach((item) => {
            rows.push({
                id: item._id,
                stock: item.stock,
                price: item.price,
                name: item.name,
            })
        });


    return (
        <Fragment>
            <MetaData title={"ALL PRODUCTS --Admin"} />
            <div className='dashboard'>
                <Sidebar />
                <div className='productListContainer'>
                    <h1 id='productListHeading'>ALL PRODUCTS</h1>
                    <DataGrid
                        columns={columns}
                        rows={rows}
                        pageSize={10}
                        disableSelectionOnClick
                        className='productListTable'
                        autoHeight
                    />
                </div>

            </div>

        </Fragment>
    )
}

export default ProductList
