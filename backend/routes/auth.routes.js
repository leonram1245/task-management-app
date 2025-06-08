import { Router } from "express";
import {
  signupController,
  loginController,
} from "../controllers/auth.controller.js";
import { validateSignup, validateLogin } from "../validators/validators.js";
// import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/signup", validateSignup, signupController);
router.post("/login", validateLogin, loginController);
// router.post("/logout", authMiddleware, logout);

export default router;
