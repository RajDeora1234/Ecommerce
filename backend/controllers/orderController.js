
import Order from "../models/orderModel.js";
import ErrorHandler from "../utils/errorHandler.js";
import { catchAsyncError } from "../middleware/catchAsyncError.js";
import Product from "../models/productModel.js"


// create new order
export const newOrder = catchAsyncError(async (req, res, next) => {

    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
    } = req.body;

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id
    });

    res.status(201).json({
        success: true,
        order,
    });

});

// get single order
export const getSingleOrder = catchAsyncError(async (req, res, next) => {

    const order = await Order.findById(req.params.id).populate("user", "name email");

    if (!order) {
        return next(new ErrorHandler("Order not found with this id"), 404);
    }

    res.status(200).json({
        success: true,
        order,
    })
});


// get logged in orders
export const myOrders = catchAsyncError(async (req, res, next) => {

    const orders = await Order.find({ user: req.user._id });

    res.status(200).json({
        success: true,
        orders,
    });

});


// get all orders --admin
export const getAllOrders = catchAsyncError(async (req, res, next) => {

    const orders = await Order.find();
    let totalAmount = 0;

    orders.forEach(order => {
        totalAmount += order.totalPrice;
    });

    res.status(200).json({
        success: true,
        totalAmount,
        orders,
    });

});
// update order status --admin
export const updateOrder = catchAsyncError(async (req, res, next) => {


    const order = await Order.findById(req.params.id);
    if (!order) {
        return next(new ErrorHandler("Order not found with this id"), 404);
    }

    if (order.orderStatus === "Delivered") {
        return next(new ErrorHandler("You have already delivered this order"), 400);
    }

    if (req.body.status === "Shipped") {
        order.orderItems.forEach(async (item) => {
            await updateStock(item.product, item.quantity);
        })
    }

    order.orderStatus = req.body.status;
    if (req.body.status === "Delivered") {
        order.deliveredAt = Date.now();
    }

    await order.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
    });

});


async function updateStock(id, quantity) {

    const product = await Product.findById(id);

    product.stock -= quantity;

    await product.save({ validateBeforeSave: false });
}


// delete order --admin
export const deleteOrder = catchAsyncError(async (req, res, next) => {

    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorHandler("Order not found with this id"), 404);
    }

    await order.deleteOne();


    res.status(200).json({
        success: true,

    });

});