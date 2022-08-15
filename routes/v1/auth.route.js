const express = require("express");
const router = express.Router();
const { validate } = require("express-validation");
const passport = require("passport");

const { auth, role } = require("../../middleware");

const { AuthController } = require("../../modules/auth/auth.controller");
const { AuthValidation } = require("../../validations");

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: true,
  })
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: `${process.env.HOST}:${process.env.PORT}/auth/loginOAuthSuccess.html`,
    failureRedirect: "/api/auth/google",
  })
);

router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: `${process.env.HOST}:${process.env.PORT}/auth/loginOAuthSuccess.html`,
    failureRedirect: "/api/auth/facebook",
  })
);

router.get("/github", passport.authenticate("github"));
router.get(
  "/github/callback",
  passport.authenticate("github", {
    successRedirect: `${process.env.HOST}:${process.env.PORT}/auth/loginOAuthSuccess.html`,
    failureRedirect: "/api/auth/github",
  })
);

router.post("/login-oauth", AuthController.loginOAuth);

router.post("/logout", AuthController.logout);

/**
 * @typedef ReqLoginJSON
 * @property {string} email.required - user's email - eg: vunam722000@gmail.com
 * @property {string} password.required - user's password
 */
/**
 * This function comment is parsed by doctrine
 * @route POST /api/v1/auth/login
 * @group Auth - Operations about auth
 * @param {ReqLoginJSON.model} body.body.required
 * @returns {object} 200 - User info
 * @returns {Error}  default - Unexpected error
 */
router.post("/login", validate(AuthValidation.login), AuthController.login);

router.get("/users/update-status", AuthController.updateStatus);

router.get("/users/forgot-password", AuthController.getRequestForgotPassword);

router.post(
  "/users/forgot-password",
  validate(AuthValidation.forgotPassword),
  AuthController.forgotPassword
);

router.get(
  "/users/reset-password/:token",
  AuthController.getRequestResetPassword
);

router.post(
  "/users/reset-password/",
  validate(AuthValidation.resetPassword),
  AuthController.resetPassword
);

module.exports = router;
