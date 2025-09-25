import express from 'express';
import {signUp, login, logout, forgotPassword, updateProfile} from "../controllers/UserController.js";
import  isAuthenticated  from "../middleware/isAuthenticated.js";


const router = express.Router();

router.route("/signUp").post(signUp);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/").get(isAuthenticated);
router.route("/forgot-password").post(forgotPassword);
router.route("/update-profile").put(isAuthenticated, updateProfile);

export default router;