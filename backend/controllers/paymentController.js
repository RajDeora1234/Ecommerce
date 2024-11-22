import { catchAsyncError } from "../middleware/catchAsyncError.js";
import { stripe } from "../app.js";


// making payment 
export const processPayment = catchAsyncError(async (req, res, next) => {

    const myPayment = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: "inr",
        metadata: {
            company: "Ecommerce",
        },
        description: 'Product or service description',
    });

    res.status(200).json({
        success: true,
        client_secret: myPayment.client_secret,
    });

})
//  sending stripe api key in front end 
export const sendStripeApiKey = catchAsyncError(async (req, res, next) => {
    console.log("api key milne wala he ");
    res.status(200).json({ stripeApiKey: process.env.STRIPE_API_KEY });
})

