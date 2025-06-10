import express from "express";
import {
  createTaskController,
  getTasksController,
  updateTaskController,
  deleteTaskController,
} from "../controllers/task.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();
router.use(authMiddleware);

router.post("/", createTaskController);
router.get("/", getTasksController);
router.put("/:id", updateTaskController);
router.delete("/:id", deleteTaskController);

export default router;
