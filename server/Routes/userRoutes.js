import express from 'express';
import { deleteUser, getAllUser, updateUser } from '../Controllers/userController.js';
import {verifyToken} from "../Middlewares/token.js"

const router = express.Router();




// Update User Details
//PATCH localhost:3000/api/user
router.patch("/update/:userId", verifyToken, updateUser);

// Delete User
//PATCH localhost:3000/api/user
router.delete("/delete/:userId", verifyToken, deleteUser);

router.get("/all", verifyToken, getAllUser);





export default router;