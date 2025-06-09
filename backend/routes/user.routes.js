import express from "express";
import {
  searchUsersController,
  getAllUsersController,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/search", searchUsersController);
router.get("/", getAllUsersController);

export default router;
