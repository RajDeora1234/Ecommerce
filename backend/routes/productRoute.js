import express from "express";
import { createProduct, getAllProducts, updateProduct, deleteProduct, getProductDetails, createProductReview, getAllReviews, deleteReview, getAdminProducts } from "../controllers/productController.js";
import { isAuthenticated, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

router.route("/products")
    .get(getAllProducts);

router.route("/admin/products")
    .get(isAuthenticated, authorizeRoles("admin"), getAdminProducts);

router.route("/admin/product/new")
    .post(isAuthenticated, authorizeRoles("admin"), createProduct);


router.route("/admin/product/:id")
    .put(isAuthenticated, authorizeRoles("admin"), updateProduct)
    .delete(isAuthenticated, authorizeRoles("admin"), deleteProduct);

router.route("/product/:id")
    .get(getProductDetails);

router.route("/review")
    .put(isAuthenticated, createProductReview);

router.route("/reviews")
    .get(getAllReviews)
    .delete(isAuthenticated, deleteReview);


export default router;




