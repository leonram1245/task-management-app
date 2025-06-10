import { jest } from "@jest/globals";

const mockVerify = jest.fn();

jest.unstable_mockModule("jsonwebtoken", () => ({
  __esModule: true,
  default: { verify: mockVerify },
}));

const { authMiddleware } = await import("../../middleware/auth.middleware.js");

describe("authMiddleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    mockVerify.mockReset();
  });

  it("should return 401 if no Authorization header", () => {
    authMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Unauthorized: No token provided",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 401 if Authorization header does not start with Bearer", () => {
    req.headers.authorization = "Token abc";
    authMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Unauthorized: No token provided",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next and set req.user, req.userId, req.token if token is valid", () => {
    req.headers.authorization = "Bearer validtoken";
    const decoded = { id: "user1", name: "Test" };
    mockVerify.mockReturnValue(decoded);

    authMiddleware(req, res, next);

    expect(mockVerify).toHaveBeenCalledWith(
      "validtoken",
      process.env.JWT_SECRET
    );
    expect(req.user).toEqual(decoded);
    expect(req.userId).toBe(decoded.id);
    expect(req.token).toBe("validtoken");
    expect(next).toHaveBeenCalled();
  });

  it("should return 403 if token is invalid", () => {
    req.headers.authorization = "Bearer invalidtoken";
    mockVerify.mockImplementation(() => {
      throw new Error("Invalid token");
    });

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      message: "Forbidden: Invalid or expired token",
    });
    expect(next).not.toHaveBeenCalled();
  });
});
