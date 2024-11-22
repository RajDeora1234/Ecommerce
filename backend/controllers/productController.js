
import Product from "../models/productModel.js";
import ErrorHandler from "../utils/errorHandler.js";
import ApiFeatures from "../utils/apifeatures.js";
import { catchAsyncError } from "../middleware/catchAsyncError.js";
import cloudinary from "cloudinary";

// create product --admin
export const createProduct = catchAsyncError(async (req, res, next) => {

    let images = [];

    if (typeof req.body.images === "string") {
        images.push(req.body.images);
    } else {
        images = req.body.images;
    }
    let imagesLink = [];
    for (let index = 0; index < images.length; index++) {
        const result = await cloudinary.v2.uploader.upload(images[index], {
            folder: "products"
        });
        imagesLink.push({
            public_id: result.public_id,
            url: result.secure_url
        });
    }

    req.body.images = imagesLink;
    req.body.user = req.user.id;
    const product = (await Product.create(req.body));

    res.status(201).json({
        success: true,
        product,
    });
})

// get all products
export const getAllProducts = catchAsyncError(async (req, res, next) => {

    const resultPerPage = 8;
    const productsCount = await Product.countDocuments();
    const apiFeatures = new ApiFeatures(Product.find(), req.query)
        .search()
        .filter()
        .pagination(resultPerPage);

    const products = await apiFeatures.query;
    res.status(200).json({
        success: true,
        products,
        productsCount,
        resultPerPage
    })

});
// get all products --admin
export const getAdminProducts = catchAsyncError(async (req, res, next) => {


    const products = await Product.find();

    res.status(200).json({
        success: true,
        products,
    })

});

// get product details
export const getProductDetails = catchAsyncError(async (req, res, next) => {


    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler("product not found", 404));

    }

    res.status(200).json({
        success: true,
        product,
    })

});

// update Product --admin
export const updateProduct = catchAsyncError(async (req, res, next) => {

    let product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler("product not found", 404));
    }

    // images start here
    let images = [];
    if (typeof req.body.images === "string") {
        images.push(req.body.images);
    } else {
        images = req.body.images;
    }

    if (images !== undefined) {
        // deleting old images from cloudinary
        for (let index = 0; index < product.images.length; index++) {
            await cloudinary.v2.uploader.destroy(product.images[index].public_id);
        }

        let imagesLinks = [];
        for (let i = 0; i < images.length; i++) {
            const result = await cloudinary.v2.uploader.upload(images[i], {
                folder: "products",
            });
            imagesLinks.push({
                public_id: result.public_id,
                url: result.secure_url,
            });
        };
        req.body.images = imagesLinks;

    } else {
        req.body.images = product.images;
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        product
    })

})


// delete product
export const deleteProduct = catchAsyncError(async (req, res, next) => {


    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("product not found", 404));
    }
    // deleting images from cloudinary
    for (let index = 0; index < product.images.length; index++) {
        await cloudinary.v2.uploader.destroy(product.images[index].public_id);
    }

    await product.deleteOne();

    res.status(200).json({
        success: true,
        message: "product deleted successfully",
    })
});


// create or update review of a product
export const createProductReview = catchAsyncError(async (req, res, next) => {

    const { rating, comment, productId } = req.body;
    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment,
    }

    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find(item => item.user.toString() === req.user._id.toString());
    if (isReviewed) {
        product.reviews.forEach(item => {
            if (item.user.toString() === req.user._id.toString()) {
                item.rating = rating;
                item.comment = comment;
            }
        })

    } else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    let avg = 0;
    product.reviews.forEach(item => {
        avg += Number(item.rating);
    });
    product.ratings = parseFloat((avg / product.reviews.length).toFixed(2));

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
    })
});

// get all review of a product
export const getAllReviews = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);
    if (!product) {
        return next(new ErrorHandler("Product not Found"), 404);
    }
    res.status(200).json({
        success: true,
        reviews: product.reviews,
    });

});

// delete review of a product
export const deleteReview = catchAsyncError(async (req, res, next) => {

    const product = await Product.findById(req.query.productId);
    if (!product) {
        return next(new ErrorHandler("Product not Found"), 404);
    }
    const reviews = product.reviews.filter(rev => rev._id.toString() !== req.query.id.toString());

    let avg = 0;
    reviews.forEach(item => {
        avg += Number(item.rating);
    });
    let ratings = 0;
    if (reviews.length === 0) {
        ratings = 0;
    }
    else {
        ratings = parseFloat((avg / reviews.length).toFixed(2));
    }
    const numOfReviews = reviews.length;

    await Product.findByIdAndUpdate(req.query.productId, {
        reviews, ratings, numOfReviews
    }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        reviews,
    })

})

