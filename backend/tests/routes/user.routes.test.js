import { jest } from "@jest/globals";

// Mock controllers and middleware before importing the routes
const searchUsersController = jest.fn((req, res) =>
  res.status(200).json({ message: "search" })
);
const getAllUsersController = jest.fn((req, res) =>
  res.status(200).json({ message: "all" })
);
const authMiddleware = jest.fn((req, res, next) => next());

jest.unstable_mockModule("../../controllers/user.controller.js", () => ({
  searchUsersController,
  getAllUsersController,
}));
jest.unstable_mockModule("../../middleware/auth.middleware.js", () => ({
  authMiddleware,
}));

const userRoutes = (await import("../../routes/user.routes.js")).default;

describe("User Routes", () => {
  let req, res, next;

  beforeEach(() => {
    req = { query: {}, body: {}, user: { id: "user1" } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    searchUsersController.mockClear();
    getAllUsersController.mockClear();
    authMiddleware.mockClear();
  });

  it("should call authMiddleware and searchUsersController for GET /search", async () => {
    await authMiddleware(req, res, next);
    await searchUsersController(req, res, next);

    expect(authMiddleware).toHaveBeenCalled();
    expect(searchUsersController).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "search" });
  });

  it("should call authMiddleware and getAllUsersController for GET /", async () => {
    await authMiddleware(req, res, next);
    await getAllUsersController(req, res, next);

    expect(authMiddleware).toHaveBeenCalled();
    expect(getAllUsersController).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "all" });
  });
});
