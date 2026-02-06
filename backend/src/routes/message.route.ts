import express from "express";
import { protectRouter } from "../middleware/auth.middleware.js";
import { getMessages, getSiderUsers, sendMessage } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/siderUsers", protectRouter, getSiderUsers);
router.get("/:id", protectRouter, getMessages);
router.post("/send/:id", protectRouter, sendMessage);

export default router;