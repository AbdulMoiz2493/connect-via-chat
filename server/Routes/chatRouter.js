import express from "express";
import { createChat, getChat, getAllChats, deleteChat, emptyChat } from "../Controllers/chatController.js";
import {verifyToken} from "../Middlewares/token.js"

const router = express.Router();

router.post("/create", verifyToken, createChat);
router.get("/get/:chatId", verifyToken, getChat);
router.get("/getAll", verifyToken, getAllChats);
router.delete("/delete/:chatId", deleteChat);
router.delete("/empty/:chatId", emptyChat);



export default router;


