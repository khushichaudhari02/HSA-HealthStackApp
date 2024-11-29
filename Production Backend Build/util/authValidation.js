const { body, check } = require("express-validator");
const validator = require("validator");
const mongoose = require("mongoose");

const forgetPasswordValidator =[
    body("email", "Invalid should not be Empty").trim().escape().not().isEmpty(),
    body("email", "Invalid email").trim().escape().isEmail(),
]

const resetPasswordValidator=[
    body("newPassword", "password does not Empty").trim().escape().not().isEmpty(),
    body("newPassword", "The minimum password length is 6 characters")
      .trim()
      .escape()
      .isLength({
        min: 6,
      }),
]

module.exports={
    forgetPasswordValidator,
    resetPasswordValidator
}