import {
  createTaskService,
  getTasksService,
  updateTaskService,
  deleteTaskService,
} from "../service/task.service.js";

export const createTaskController = async (req, res) => {
  try {
    const { title, description } = req.body;
    const task = await createTaskService({
      title,
      description,
      userId: req.userId,
    });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getTasksController = async (req, res) => {
  try {
    const tasks = await getTasksService(req.userId);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateTaskController = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const result = await updateTaskService({
      id,
      title,
      description,
      userId: req.userId,
    });
    if (result.count === 0)
      return res
        .status(404)
        .json({ error: "Task not found or not authorized" });
    res.json({ message: "Updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteTaskController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteTaskService({ id, userId: req.userId });
    if (result.count === 0)
      return res
        .status(404)
        .json({ error: "Task not found or not authorized" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
