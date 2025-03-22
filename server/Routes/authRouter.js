import express from 'express';
import { google, login, logout, signup } from '../Controllers/authController.js';
import { verifyToken } from '../Middlewares/token.js';


const router = express.Router();


//POST localhost:3000/api/auth
router.post("/login", login);   //Login
router.post("/signup", signup); //Signup
router.post("/google", google); //google Login
router.post("/logout", logout); //Logout


export default router;