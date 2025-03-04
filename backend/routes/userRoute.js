import express from 'express';
import { deleteUser, forgotPassword, getAllUsers, getSingleUser, getUserDetails, loginUser, logoutUser, registerUser, resetPassword, updatePassword, updateProfile, updateUserRole } from '../controllers/userController.js';
import { isAuthenticated, authorizeRoles } from "../middleware/auth.js";
const router = express.Router();


router.route('/register')
    .post(registerUser);

router.route("/login")
    .post(loginUser);

router.route("/logout")
    .post(logoutUser);

router.route("/password/forgot")
    .post(forgotPassword);

router.route("/password/reset/:token")
    .put(resetPassword);

router.route("/me")
    .get(isAuthenticated, getUserDetails);

router.route("/password/update")
    .put(isAuthenticated, updatePassword);

router.route("/me/update")
    .put(isAuthenticated, updateProfile);

router.route("/admin/users")
    .get(isAuthenticated, authorizeRoles("admin"), getAllUsers);

router.route("/admin/user/:id")
    .get(isAuthenticated, authorizeRoles("admin"), getSingleUser)
    .put(isAuthenticated, authorizeRoles("admin"), updateUserRole)
    .delete(isAuthenticated, authorizeRoles("admin"), deleteUser);



export default router;
