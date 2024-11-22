import User from "../models/userModel.js";
import ErrorHandler from "../utils/errorHandler.js";
import { sendToken } from "../utils/jwtToken.js";
import { catchAsyncError } from "../middleware/catchAsyncError.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";
import cloudinary from "cloudinary";

// register a user
export const registerUser = catchAsyncError(async (req, res, next) => {

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 150,
        crop: "scale"
    });
    const { name, email, password } = req.body;
    const user = await User.create({
        name, email, password,
        avatar: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        }
    });

    sendToken(user, 201, res);

});

// user login
export const loginUser = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorHandler("Please enter email and password", 400));
    }

    const user = await User.findOne({ email }).select("+password");


    if (!user) {
        return next(new ErrorHandler("Invalid emial or password", 401));
    }

    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid emial or password", 401));
    }

    sendToken(user, 200, res);
});

// user logout
export const logoutUser = catchAsyncError(async (req, res, next) => {

    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: "Logged Out",
    })

});

// forgot password
export const forgotPassword = catchAsyncError(async (req, res, next) => {

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorHandler("user not found", 404));
    }

    // getResetPasswordToken
    const resetPasswordToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetPasswordToken}`;

    const message = `Your password reset token is:- \n\n ${resetPasswordToken} \n\n If you have not requested this email then, Please ignore it.`

    try {
        await sendEmail({
            email: user.email,
            subject: "Ecommerce password Recovery",
            message,
        });

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully.`
        })


    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new ErrorHandler(error.message, 500));
    }


});

// password reset
export const resetPassword = catchAsyncError(async (req, res, next) => {

    // creating token hash
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });


    if (!user) {
        return next(new ErrorHandler("Reset Password Token is Invalid or has been expired", 400));
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password does not match", 404));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res);

});

// get user details
export const getUserDetails = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user,
    });

});

// update user password
export const updatePassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Old Password is Incorrect", 401));
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password does not match", 404));
    }

    user.password = req.body.newPassword;

    await user.save();

    sendToken(user, 200, res);

});

// update user profile
export const updateProfile = catchAsyncError(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
    };

    if (req.body.avatar !== "") {
        const user = await User.findById(req.user.id);
        const imageId = user.avatar.public_id;
        await cloudinary.v2.uploader.destroy(imageId);
        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: "avatars",
            width: 150,
            crop: "scale"
        });
        newUserData.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        }

    }
    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
    })

});

// get all users  --admin
export const getAllUsers = catchAsyncError(async (req, res, next) => {

    const users = await User.find();

    res.status(200).json({
        success: true,
        users,
    })

});

// get single user  --admin
export const getSingleUser = catchAsyncError(async (req, res, next) => {

    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorHandler(`User does not exist with ${req.params.id} `, 400));
    }

    res.status(200).json({
        success: true,
        user,
    })

});


// update user role --admin
export const updateUserRole = catchAsyncError(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    };


    await User.findByIdAndUpdate(req.params.id, newUserData, {
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
    })

});

// delete user  --admin
export const deleteUser = catchAsyncError(async (req, res, next) => {

    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHandler(`User does not exist with ${req.params.id}`), 400);
    }

    const imageId = user.avatar.public_id;
    await cloudinary.v2.uploader.destroy(imageId);

    await user.deleteOne();

    res.status(200).json({
        success: true,
        message: "User deleted successfully",
    })

});

