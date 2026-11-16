import { Router } from "express";
import { login } from "../controllers/LoginController.js";
import {
  melihatSession,
  logout,
} from "../controllers/AuthController.js";
import { wajibLogin } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/login", login);
router.get("/session", wajibLogin, melihatSession);
router.post("/logout", wajibLogin, logout);

export default router;