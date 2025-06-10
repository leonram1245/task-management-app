import { jest } from "@jest/globals";

const signupController = jest.fn((req, res) =>
  res.status(201).json({ message: "signup" })
);
const loginController = jest.fn((req, res) =>
  res.status(200).json({ message: "login" })
);
const validateSignup = jest.fn((req, res, next) => next());
const validateLogin = jest.fn((req, res, next) => next());

jest.unstable_mockModule("../../controllers/auth.controller.js", () => ({
  signupController,
  loginController,
}));

describe("Auth Routes", () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: { email: "a@b.com", password: "pw" } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    validateSignup.mockClear();
    validateLogin.mockClear();
    signupController.mockClear();
    loginController.mockClear();
  });

  it("should call validateSignup and signupController for /signup", async () => {
    await validateSignup(req, res, next);
    await signupController(req, res, next);

    expect(validateSignup).toHaveBeenCalled();
    expect(signupController).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: "signup" });
  });

  it("should call validateLogin and loginController for /login", async () => {
    await validateLogin(req, res, next);
    await loginController(req, res, next);

    expect(validateLogin).toHaveBeenCalled();
    expect(loginController).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "login" });
  });
});
