import express from 'express';
import {signUp, login, logout} from "../controllers/UserController.js";
import  isAuthenticated  from "../middleware/isAuthenticated.js";


const router = express.Router();

router.route("/signUp").post(signUp);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/").get(isAuthenticated);


export default router;