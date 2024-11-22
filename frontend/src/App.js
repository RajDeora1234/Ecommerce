import { useEffect } from 'react';
import './App.css';
import Header from "./components/layout/Header/Header";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import WebFont from "webfontloader";
import Footer from "./components/layout/Footer/Footer"
import Home from "./components/Home/Home"
import ProductDetails from "./components/Product/ProductDetails"
import Products from "./components/Product/Products"
import Search from "./components/Product/Search"
import LoginSignUp from './components/User/LoginSignUp';
import store from './store';
import { loadUser } from './actions/userAction';
import { useSelector } from 'react-redux';
import UserOptions from "./components/layout/Header/UserOptions";
import Profile from "./components/User/Profile";
import ProtectedRoute from './components/Route/ProtectedRoute';
import UpdateProfile from "./components/User/UpdateProfile";
import UpdatePassword from "./components/User/UpdatePassword";
import ForgotPassword from "./components/User/ForgotPassword";
import ResetPassword from "./components/User/ResetPassword";
import Cart from "./components/Cart/Cart"
import Shipping from "./components/Cart/Shipping";
import ConfirmOrder from "./components/Cart/ConfirmOrder";
import Payment from "./components/Cart/Payment";
import OrderSuccess from "./components/Cart/OrderSuccess";
import MyOrders from "./components/Order/MyOrders";
import OrderDetails from "./components/Order/OrderDetails";
import Dashboard from "./components/Admin/Dashboard";
import ProductList from "./components/Admin/ProductList";
import NewProduct from './components/Admin/NewProduct';
import UpdateProduct from "./components/Admin/UpdateProduct";
import OrderList from "./components/Admin/OrderList";
import ProcessOrder from "./components/Admin/ProcessOrder";
import UsersList from "./components/Admin/UsersList";
import UpdateUser from "./components/Admin/UpdateUser";
import ProductReviews from "./components/Admin/ProductReviews";
import Contact from "./components/layout/Contact/Contact";
import About from "./components/layout/About/About";
import NotFound from "./components/layout/Not Found/NotFound";

function App() {
  const { isAuthenticated, user } = useSelector(state => state.userReducer);

  useEffect(() => {
    WebFont.load({
      googe: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
      }
    })
    store.dispatch(loadUser());
  }, []);

  window.addEventListener("contextmenu", (e) => e.preventDefault());

  return (
    <Router>
      <Header />
      {isAuthenticated && <UserOptions user={user} />}

      <Routes>

        <Route exact path='/' Component={Home} />
        <Route exact path='/product/:id' Component={ProductDetails} />
        <Route exact path='/products' Component={Products} />
        <Route path='/products/:keyword' Component={Products} />
        <Route exact path='/search' Component={Search} />
        <Route exact path='/login' Component={LoginSignUp} />
        <Route exact path='/contact' Component={Contact} />
        <Route exact path='/about' Component={About} />
        <Route path='/password/forgot' Component={ForgotPassword} />
        <Route path='/password/reset/:token' Component={ResetPassword} />
        <Route path='/cart' Component={Cart} />
        <Route path='/account' element={<ProtectedRoute Component={Profile} isAuthenticated={isAuthenticated} />} />
        <Route path='/me/update' element={<ProtectedRoute Component={UpdateProfile} isAuthenticated={isAuthenticated} />} />
        <Route path='/password/update' element={<ProtectedRoute Component={UpdatePassword} isAuthenticated={isAuthenticated} />} />
        <Route exact path='/shipping' element={<ProtectedRoute Component={Shipping} isAuthenticated={isAuthenticated} />} />
        <Route exact path='/order/confirm' element={<ProtectedRoute Component={ConfirmOrder} isAuthenticated={isAuthenticated} />} />
        <Route exact path='/process/payment' element={<ProtectedRoute Component={Payment} isAuthenticated={isAuthenticated} />} />
        <Route exact path='/succcess' element={<ProtectedRoute Component={OrderSuccess} isAuthenticated={isAuthenticated} />} />
        <Route exact path='/orders' element={<ProtectedRoute Component={MyOrders} isAuthenticated={isAuthenticated} />} />
        <Route exact path='/order/:id' element={<ProtectedRoute Component={OrderDetails} isAuthenticated={isAuthenticated} />} />
        <Route exact path='/admin/dashboard' element={<ProtectedRoute Component={Dashboard} isAuthenticated={isAuthenticated} isAdmin={true} />} />
        <Route exact path='/admin/products' element={<ProtectedRoute Component={ProductList} isAuthenticated={isAuthenticated} isAdmin={true} />} />
        <Route exact path='/admin/product' element={<ProtectedRoute Component={NewProduct} isAuthenticated={isAuthenticated} isAdmin={true} />} />
        <Route exact path='/admin/product/:id' element={<ProtectedRoute Component={UpdateProduct} isAuthenticated={isAuthenticated} isAdmin={true} />} />
        <Route exact path='/admin/orders' element={<ProtectedRoute Component={OrderList} isAuthenticated={isAuthenticated} isAdmin={true} />} />
        <Route exact path='/admin/order/:id' element={<ProtectedRoute Component={ProcessOrder} isAuthenticated={isAuthenticated} isAdmin={true} />} />
        <Route exact path='/admin/users' element={<ProtectedRoute Component={UsersList} isAuthenticated={isAuthenticated} isAdmin={true} />} />
        <Route exact path='/admin/user/:id' element={<ProtectedRoute Component={UpdateUser} isAuthenticated={isAuthenticated} isAdmin={true} />} />
        <Route exact path='/admin/reviews' element={<ProtectedRoute Component={ProductReviews} isAuthenticated={isAuthenticated} isAdmin={true} />} />
        <Route path="*" Component={NotFound} />
      </Routes>
      <Footer />

    </Router>
  );
}

export default App;
