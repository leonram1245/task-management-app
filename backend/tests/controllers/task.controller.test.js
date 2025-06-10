import { jest } from "@jest/globals";

// Mock the task service module before importing the controller
jest.unstable_mockModule("../../service/task.service.js", () => ({
  createTaskService: jest.fn(),
  getTasksService: jest.fn(),
  updateTaskService: jest.fn(),
  deleteTaskService: jest.fn(),
}));

const taskService = await import("../../service/task.service.js");
const {
  createTaskController,
  getTasksController,
  updateTaskController,
  deleteTaskController,
} = await import("../../controllers/task.controller.js");

describe("Task Controller", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      user: { id: "user1" },
      userId: "user1",
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("createTaskController", () => {
    it("should create a task and return 201", async () => {
      const mockTask = { id: "1", title: "Test Task" };
      req.body = {
        title: "Test Task",
        description: "desc",
        assignedToId: "user2",
      };
      taskService.createTaskService.mockResolvedValue(mockTask);

      await createTaskController(req, res);

      expect(taskService.createTaskService).toHaveBeenCalledWith({
        title: "Test Task",
        description: "desc",
        assignedTo: "user2",
        assignedBy: "user1",
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockTask);
    });

    it("should handle errors and return 500", async () => {
      taskService.createTaskService.mockRejectedValue(new Error("fail"));
      await createTaskController(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "fail" });
    });
  });

  describe("getTasksController", () => {
    it("should return tasks", async () => {
      const mockTasks = [{ id: "1" }, { id: "2" }];
      taskService.getTasksService.mockResolvedValue(mockTasks);

      await getTasksController(req, res);

      expect(taskService.getTasksService).toHaveBeenCalledWith("user1");
      expect(res.json).toHaveBeenCalledWith(mockTasks);
    });

    it("should handle errors and return 500", async () => {
      taskService.getTasksService.mockRejectedValue(new Error("fail"));
      await getTasksController(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "fail" });
    });
  });

  describe("updateTaskController", () => {
    it("should update a task and return message", async () => {
      const mockResult = { id: "1", title: "Updated" };
      req.params = { id: "1" };
      req.body = { title: "Updated", description: "desc", status: "DONE" };
      taskService.updateTaskService.mockResolvedValue(mockResult);

      await updateTaskController(req, res);

      expect(taskService.updateTaskService).toHaveBeenCalledWith({
        id: "1",
        title: "Updated",
        description: "desc",
        status: "DONE",
        userId: "user1",
      });
      expect(res.json).toHaveBeenCalledWith({
        message: "Task updated",
        task: mockResult,
      });
    });

    it("should return 404 for not found or unauthorized", async () => {
      req.params = { id: "1" };
      const error = new Error("Task not found");
      taskService.updateTaskService.mockRejectedValue(error);

      await updateTaskController(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Task not found" });
    });

    it("should return 500 for other errors", async () => {
      req.params = { id: "1" };
      const error = new Error("Some other error");
      taskService.updateTaskService.mockRejectedValue(error);

      await updateTaskController(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Some other error" });
    });
  });

  describe("deleteTaskController", () => {
    it("should delete a task and return message", async () => {
      req.params = { id: "1" };
      const mockDeleted = { id: "1" };
      taskService.deleteTaskService.mockResolvedValue(mockDeleted);

      await deleteTaskController(req, res);

      expect(taskService.deleteTaskService).toHaveBeenCalledWith({
        id: "1",
        userId: "user1",
      });
      expect(res.json).toHaveBeenCalledWith({
        message: "Task deleted successfully",
        task: mockDeleted,
      });
    });

    it("should handle errors and return 403", async () => {
      req.params = { id: "1" };
      taskService.deleteTaskService.mockRejectedValue(
        new Error("Unauthorized")
      );

      await deleteTaskController(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized" });
    });
  });
});
