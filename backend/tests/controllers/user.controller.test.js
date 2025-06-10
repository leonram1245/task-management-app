import { jest } from "@jest/globals";

jest.unstable_mockModule("../../service/user.service.js", () => ({
  searchUsersService: jest.fn(),
  getAllUsersService: jest.fn(),
}));

const userService = await import("../../service/user.service.js");
const { searchUsersController, getAllUsersController } = await import(
  "../../controllers/user.controller.js"
);

describe("User Controller", () => {
  let req, res;

  beforeEach(() => {
    req = {
      query: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("searchUsersController", () => {
    it("should return users for a query", async () => {
      const mockUsers = [{ id: "1" }, { id: "2" }];
      req.query.q = "john";
      userService.searchUsersService.mockResolvedValue(mockUsers);

      await searchUsersController(req, res);

      expect(userService.searchUsersService).toHaveBeenCalledWith("john");
      expect(res.json).toHaveBeenCalledWith(mockUsers);
    });

    it("should handle errors and return 500", async () => {
      userService.searchUsersService.mockRejectedValue(new Error("fail"));

      await searchUsersController(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Internal server error" });
    });
  });

  describe("getAllUsersController", () => {
    it("should return all users", async () => {
      const mockUsers = [{ id: "1" }, { id: "2" }];
      userService.getAllUsersService.mockResolvedValue(mockUsers);

      await getAllUsersController(req, res);

      expect(userService.getAllUsersService).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockUsers);
    });

    it("should handle errors and return 500", async () => {
      userService.getAllUsersService.mockRejectedValue(new Error("fail"));

      await getAllUsersController(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
    });
  });
});
