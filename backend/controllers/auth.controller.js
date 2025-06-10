import { signupService, loginService } from "../service/auth.service.js";

export const signupController = async (req, res, next) => {
  try {
    const result = await signupService(req.body);
    res.status(201).json(result);
  } catch (err) {
    const status = err.statusCode || 400;
    const message = err.message || "Signup failed";
    res.status(status).json({ message });
  }
};

export const loginController = async (req, res) => {
  try {
    const result = await loginService(req.body);
    res.status(200).json(result);
  } catch (err) {
    const status = err.statusCode || 401;
    const message = err.message || "Login failed";
    res.status(status).json({ message });
  }
};
