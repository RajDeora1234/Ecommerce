import express from "express";
import { isAuthenticated } from "../middleware/auth.js";
import { processPayment, sendStripeApiKey } from "../controllers/paymentController.js";

const router = express.Router();

router.route("/payment/process")
    .post(isAuthenticated, processPayment);

router.route("/stripeapikey")
    .get(isAuthenticated, sendStripeApiKey);


export default router;
