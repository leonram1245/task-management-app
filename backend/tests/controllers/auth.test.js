import { jest } from "@jest/globals";

// Mock the auth service using ESM-safe unstable_mockModule
jest.unstable_mockModule("../../service/auth.service.js", () => ({
  signupService: jest.fn(),
  loginService: jest.fn(),
}));

// Dynamically import the modules after mocking
const authService = await import("../../service/auth.service.js");
const { signupController, loginController } = await import(
  "../../controllers/auth.controller.js"
);

describe("Auth Controller", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      body: {
        email: "test@example.com",
        password: "pass123",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("signupController", () => {
    it("should return 201 and result on successful signup", async () => {
      const mockResult = { id: 1, email: "test@example.com" };
      authService.signupService.mockResolvedValue(mockResult);

      await signupController(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });

    it("should handle errors and return status/message", async () => {
      const error = { statusCode: 400, message: "Signup failed" };
      authService.signupService.mockRejectedValue(error);

      await signupController(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Signup failed" });
    });
  });

  describe("loginController", () => {
    it("should return 200 and result on successful login", async () => {
      const mockResult = { token: "abc123" };
      authService.loginService.mockResolvedValue(mockResult);

      await loginController(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });

    it("should handle errors and return status/message", async () => {
      const error = { statusCode: 401, message: "Login failed" };
      authService.loginService.mockRejectedValue(error);

      await loginController(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: "Login failed" });
    });
  });
});
