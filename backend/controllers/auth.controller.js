import { signupService, loginService } from "../service/auth.service.js";

export const signupController = async (req, res, next) => {
  try {
    const result = await signupService(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

export const loginController = async (req, res, next) => {
  try {
    const result = await loginService(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
};
