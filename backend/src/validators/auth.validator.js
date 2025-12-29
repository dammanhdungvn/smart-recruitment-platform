const { body } = require("express-validator");

const registerValidator = [
  body("email").isEmail().withMessage("Invalid email address").normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("full_name")
    .trim()
    .notEmpty()
    .withMessage("Full name is required")
    .isLength({ min: 2, max: 255 })
    .withMessage("Full name must be between 2 and 255 characters"),
  body("role")
    .optional()
    .isIn(["candidate", "recruiter"])
    .withMessage("Role must be either candidate or recruiter"),
  body("phone").optional().isMobilePhone().withMessage("Invalid phone number"),
];

const loginValidator = [
  body("email").isEmail().withMessage("Invalid email address").normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
];

const changePasswordValidator = [
  body().custom((value, { req }) => {
    // Accept either oldPassword or currentPassword
    if (!req.body.oldPassword && !req.body.currentPassword) {
      throw new Error("Current password is required");
    }
    return true;
  }),
  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters")
    .custom((value, { req }) => {
      const oldPass = req.body.oldPassword || req.body.currentPassword;
      if (value === oldPass) {
        throw new Error("New password must be different from current password");
      }
      return true;
    }),
];

module.exports = {
  registerValidator,
  loginValidator,
  changePasswordValidator,
};
