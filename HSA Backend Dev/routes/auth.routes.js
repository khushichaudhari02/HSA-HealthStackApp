const express = require("express");
const authController = require("../controllers/auth.controller");
const validation = require("../util/validation");
const authValidator = require('../util/authValidation');
const router = express.Router();
router.post(
  "/signup",
  validation.signupValidator,
  authController.signupPatient
); //allows patient to signup
router.post("/login",validation.loginValidator, authController.login); // allows anybody to login because their user object will have role and by that we will set their json web token
// router.post(
//   "/hospital/signup",
//   authController.signupHospital
// ); //allows only the superAdmin to Signup a hospital admin.

router.post("/forget-password", authValidator.forgetPasswordValidator,authController.forgetPassword);
router.post("/reset-password/:token", authValidator.resetPasswordValidator,authController.resetPassword);
module.exports = router;
