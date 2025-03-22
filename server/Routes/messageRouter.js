import express from "express";
import {verifyToken} from "../Middlewares/token.js"
import { getMessages } from "../Controllers/messageController.js";

const router = express.Router();

router.get("/:chatId", verifyToken, getMessages);



export default router;


