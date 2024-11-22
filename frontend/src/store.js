import { createStore, combineReducers, applyMiddleware } from "redux"
import { thunk } from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension"
import { deleteProductReducer, newProductReducer, newReviewReducer, productDetailsReducer, productReducer, productReviewsReducer, reviewReducer } from "./reducers/productReducer";
import { allUsersReducer, forgotPasswordReducer, profileReducer, userDetailsReducer, userReducer } from "./reducers/userReducer";
import { cartReducer } from "./reducers/cartReducer";
import { allOrdersReducer, myOrdersReducer, newOrderReducer, orderDetailsReducer, orderReducer } from "./reducers/orderReducer";

const reducer = combineReducers({
    productReducer,
    productDetailsReducer,
    userReducer,
    profileReducer,
    forgotPasswordReducer,
    cartReducer,
    newOrderReducer,
    myOrdersReducer,
    orderDetailsReducer,
    newReviewReducer,
    newProductReducer,
    deleteProductReducer,
    allOrdersReducer,
    orderReducer,
    allUsersReducer,
    userDetailsReducer,
    productReviewsReducer,
    reviewReducer,

});

const initialState = {
    cartReducer: {
        cartItems: localStorage.getItem("cartItems") ? JSON.parse(localStorage.getItem("cartItems")) : [],
        shippingInfo: localStorage.getItem("shippingInfo") ? JSON.parse(localStorage.getItem("shippingInfo")) : {},
    }
};
const middleWare = [thunk];

const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middleWare)));

export default store;
