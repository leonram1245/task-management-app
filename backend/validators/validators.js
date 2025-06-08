import { body, param, validationResult } from "express-validator";

// 🧼 Shared validation handler
const handleValidation = (validations) => [
  ...validations,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    next();
  },
];

// 🔐 Auth validators
export const validateSignup = handleValidation([
  body("email").isEmail().withMessage("Invalid email format"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
]);

export const validateLogin = handleValidation([
  body("email").isEmail().withMessage("Invalid email format"),
  body("password").exists().withMessage("Password is required"),
]);

// ✅ Task validators
export const createTaskValidator = handleValidation([
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 100 })
    .withMessage("Title must be less than 100 characters"),
  body("description")
    .optional()
    .isLength({ max: 1000 })
    .withMessage("Description must be less than 1000 characters"),
]);

export const updateTaskValidator = handleValidation([
  param("id")
    .isInt({ gt: 0 })
    .withMessage("Task ID must be a positive integer"),
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty")
    .isLength({ max: 100 })
    .withMessage("Title must be less than 100 characters"),
  body("description")
    .optional()
    .isLength({ max: 1000 })
    .withMessage("Description must be less than 1000 characters"),
]);
