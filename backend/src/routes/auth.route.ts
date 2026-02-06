import express from "express";
import { signup, login, logout, updateProfile, checkAuth } from "../controllers/auth.controller.js";
import { protectRouter } from "../middleware/auth.middleware.js";
//express路由 挂载api
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.put("/profile", protectRouter, updateProfile);
router.get("/checkAuth", protectRouter, checkAuth);

export default router;
