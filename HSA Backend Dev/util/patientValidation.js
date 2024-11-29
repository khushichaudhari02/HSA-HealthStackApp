const { body, check } = require("express-validator");
const validator = require("validator");
const mongoose = require("mongoose");

const bookAppointmentValidator = [
  body("scheduleId", "Hospital Id cannot be empty")
    .trim()
    .escape()
    .not()
    .isEmpty(),
  body("scheduleId", "Invalid object hospitalId").custom((value) => {
    return mongoose.isValidObjectId(value);
  }),
  body("hospitalId", "Hospital Id cannot be empty")
    .trim()
    .escape()
    .not()
    .isEmpty(),
  body("hospitalId", "Invalid object hospitalId").custom((value) => {
    return mongoose.isValidObjectId(value);
  }),
  body("dId", "Invalid object dId").custom((value) => {
    return mongoose.isValidObjectId(value);
  }),
  body("dId", "dId cannot be empty").trim().escape().not().isEmpty(),
  body("bookingStart").custom((value) => {
    if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(value)) {
      throw new Error("Start time Value must be time with HH:MM format");
    }
    return true;
  }),
  body("date")
    .trim()
    .isDate()
    .withMessage("Date must be in the format yyyy-MM-dd"),
];
const checkAvailabilityValidator = [
  body("hospitalId", "Hospital Id cannot be empty")
    .trim()
    .escape()
    .not()
    .isEmpty(),
  body("hospitalId", "Invalid object hospitalId").custom((value) => {
    return mongoose.isValidObjectId(value);
  }),
  body("dId", "Invalid object dId").custom((value) => {
    return mongoose.isValidObjectId(value);
  }),
  body("dId", "dId cannot be empty").trim().escape().not().isEmpty(),
  body("bookingStart").custom((value) => {
    if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(value)) {
      throw new Error("Start time Value must be time with HH:MM format");
    }
    return true;
  }),
  body("date")
    .trim().isDate()
    .withMessage("Date must be in the format yyyy/MM/dd"),
];
const searchHospital = [
  check("city", "City cannot be empty").trim().escape(),
  check("hospitalSpecialty", "hospital specialty cannot be emtpy")
    .trim()
    .escape(),
];
const findAppointmentsValidator = [
  check().custom((value, { req }) => {
    if (req.query.date && !/^\\d{4}-\d{2}-\d{2}$/.test(req.query.date.trim())) {
      throw new Error("date value must be time with dd-mm-yyyy format");
    } else if (req.query.month && !/^\d{4}-\d{2}$/.test(req.query.month.trim())) {
      throw new Error("month value must be time with mm-yyyy format");
    }
    return true;
  }),
  check('page').trim().escape()
];
const AppointmentDetailsValidator = [
  check("aId", "Invalid object aId").custom((value) => {
    return mongoose.isValidObjectId(value);
  }),
];
module.exports = {
  bookAppointmentValidator,
  searchHospital,
  checkAvailabilityValidator,
  findAppointmentsValidator,
  AppointmentDetailsValidator
};
