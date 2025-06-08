import express from "express";
import {
  createTaskController,
  getTasksController,
  updateTaskController,
  deleteTaskController,
} from "../controllers/task.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  createTaskValidator,
  updateTaskValidator,
} from "../validators/validators.js";

const router = express.Router();
router.use(authMiddleware);

router.post("/", createTaskValidator, createTaskController);
router.get("/", getTasksController);
router.put("/:id", updateTaskValidator, updateTaskController);
router.delete("/:id", deleteTaskController);

export default router;
