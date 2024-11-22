import ErrorHandler from "../utils/errorHandler.js";

export const errorMiddleWare = (err, req, res, next) => {

    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal server error";

    // wrong mongodb id error
    if (err.name === "CastError") {
        const message = `Resource not found. Invalid ${err.path}`;
        err = new ErrorHandler(message, 400);
    }

    // mongodb duplicate key error
    if (err.code === 1100) {
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
        err = new ErrorHandler(message, 400);
    }

    // json webtoken error
    if (err.name === "jsonWebTokenError") {
        const message = `Json Web Token is invalid, try again`;
        err = new ErrorHandler(message, 400);
    }
    // json webtoken Expire error
    if (err.name === "TokenExpiredError") {
        const message = `Json Web Token is Expired, try again`;
        err = new ErrorHandler(message, 400);
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message
    })
};
