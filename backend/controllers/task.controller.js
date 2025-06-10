import {
  createTaskService,
  getTasksService,
  updateTaskService,
  deleteTaskService,
} from "../service/task.service.js";

export const createTaskController = async (req, res) => {
  try {
    const { title, description, assignedToId } = req.body;
    const task = await createTaskService({
      title,
      description,
      assignedTo: assignedToId,
      assignedBy: req.user.id,
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
    const { title, description, status } = req.body;

    const result = await updateTaskService({
      id,
      title,
      description,
      status,
      userId: req.userId,
    });

    res.json({ message: "Task updated", task: result });
  } catch (err) {
    if (
      err.message === "Task not found" ||
      err.message === "Not authorized to update this task"
    ) {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

export const deleteTaskController = async (req, res) => {
  try {
    const deleted = await deleteTaskService({
      id: req.params.id,
      userId: req.user.id,
    });

    res.json({ message: "Task deleted successfully", task: deleted });
  } catch (err) {
    res.status(403).json({ message: err.message || "Unauthorized" });
  }
};
