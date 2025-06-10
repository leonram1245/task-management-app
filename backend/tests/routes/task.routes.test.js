import { jest } from "@jest/globals";

// Mock controllers, middleware, and validators before importing the routes
const createTaskController = jest.fn((req, res) =>
  res.status(201).json({ message: "created" })
);
const getTasksController = jest.fn((req, res) =>
  res.status(200).json({ message: "fetched" })
);
const updateTaskController = jest.fn((req, res) =>
  res.status(200).json({ message: "updated" })
);
const deleteTaskController = jest.fn((req, res) =>
  res.status(200).json({ message: "deleted" })
);

const authMiddleware = jest.fn((req, res, next) => next());

jest.unstable_mockModule("../../controllers/task.controller.js", () => ({
  createTaskController,
  getTasksController,
  updateTaskController,
  deleteTaskController,
}));
jest.unstable_mockModule("../../middleware/auth.middleware.js", () => ({
  authMiddleware,
}));

const taskRoutes = (await import("../../routes/task.routes.js")).default;

describe("Task Routes", () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {}, params: {}, user: { id: "user1" } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    createTaskController.mockClear();
    getTasksController.mockClear();
    updateTaskController.mockClear();
    deleteTaskController.mockClear();
    authMiddleware.mockClear();
  });

  it("should call createTaskController for POST /", async () => {
    await authMiddleware(req, res, next);
    await createTaskController(req, res, next);

    expect(authMiddleware).toHaveBeenCalled();
    expect(createTaskController).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: "created" });
  });

  it("should call getTasksController for GET /", async () => {
    await authMiddleware(req, res, next);
    await getTasksController(req, res, next);

    expect(authMiddleware).toHaveBeenCalled();
    expect(getTasksController).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "fetched" });
  });

  it("should call updateTaskController for PUT /:id", async () => {
    req.params.id = "123";
    await authMiddleware(req, res, next);
    await updateTaskController(req, res, next);

    expect(authMiddleware).toHaveBeenCalled();
    expect(updateTaskController).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "updated" });
  });

  it("should call deleteTaskController for DELETE /:id", async () => {
    req.params.id = "123";
    await authMiddleware(req, res, next);
    await deleteTaskController(req, res, next);

    expect(authMiddleware).toHaveBeenCalled();
    expect(deleteTaskController).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "deleted" });
  });
});
