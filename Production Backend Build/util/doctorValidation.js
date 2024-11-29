const { body, check } = require("express-validator");
const validator = require("validator");
const mongoose = require("mongoose");
const { updateOffDays } = require("../controllers/doctor.controller");
const { updateDoctorOffDaysValidatator } = require("./adminValidation");

updateDoctorProfileValidator = [
  body("email", "Invalid should not be Empty").trim().escape().not().isEmpty(),
  body("email", "Invalid email").trim().escape().isEmail(),
  body("name.firstName", "The first name should not be empty")
    .trim()
    .escape()
    .not()
    .isEmpty(),
  body("name.middleName").trim().escape(),
  body("name.lastName", "The last name should not by empty")
    .trim()
    .escape()
    .not()
    .isEmpty(),
  body("phoneNumber", "Mobile number must be 10 digit long")
    .trim()
    .escape()
    .isLength({
      min: 10,
      max:10
    }),
  body("phoneNumber", "Mobile number must not be empty")
    .trim()
    .escape()
    .not()
    .isEmpty(),
  body("sex", "This field cannot be empty").trim().escape().not().isEmpty(),
  body("age", "Age cannot be empty").trim().escape().not().isEmpty(),
  body("address.state").trim().escape(),
  body("address.district").trim().escape(),
  body("address.city").trim().escape(),
  body("address.streetAddess1").trim().escape(),
  body("address.streetAddress2").trim().escape(),
  body("address.postalCode").trim().escape(),
  body("address.landmark").trim().escape(),
  body().custom((value, { req }) => {
    if (
      req.body.address.state &&
      req.body.address.district &&
      req.body.address.city &&
      (req.body.address.streetAddress1 || req.body.streetAddress2) &&
      req.body.address.postalCode &&
      req.body.address.landmark
    ) {
      return true;
    } else if (
      !req.body.address.state &&
      !req.body.address.district &&
      !req.body.address.city &&
      !req.body.address.postalCode &&
      !req.body.address.landmark &&
      !req.body.address.streetAddress1 &&
      !req.body.address.streetAddresss2
    ) {
      return true;
    } else {
      throw new Error(
        "All Address fields must be filled together or either set empty"
      );
    }
  }),
  body("shifts.*.startTime").custom((value) => {
    if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(value)) {
      throw new Error("Start time Value must be time with HH:MM format");
    }
    return true;
  }),
  body("shifts.*.endTime").custom((value) => {
    if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(value)) {
      throw new Error("End time Value must be time with HH:MM format");
    }
    return true;
  }),
  body("appointmentDuration")
    .trim()
    .isNumeric()
    .withMessage("the booking duration should be a number"),
  body("registrationNumber", "registration number cannot be empty")
    .trim()
    .escape()
    .not()
    .isEmpty(),
  body("yearOfRegistration", "year of registration cannot be empty")
    .trim()
    .escape()
    .not()
    .isEmpty(),
  body("stateMedicalCouncil", "medical council cannot be empty")
    .trim()
    .escape()
    .not()
    .isEmpty(),
  body("educationQualification.*").trim().escape(),
  body("educationQualification")
  .isArray()
  .custom((value, { req }) => {
    if (value.length === 0) {
      return true;
    }
    return value.every(
      (item) => typeof item === "string" && item.trim().length > 0
    );
  })
  .withMessage("testPrescribed must be an array of non-empty strings"),
  body("specialty.*").trim().escape(),
  body("specialty")
    .isArray()
    .custom((value, { req }) => {
      if (value.length === 0) {
        return true;
      }
      return value.every(
        (item) => typeof item === "string" && item.trim().length > 0
      );
    })
    .withMessage("specialty must be an array of non-empty strings"),
];
const getScheduleValidator = [
  body("date")
    .trim()
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage("Date must be in the format yyyy-MM-dd"),
  body("shift.startTime").custom((value) => {
    if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(value)) {
      throw new Error("Start time Value must be time with HH:MM format");
    }
    return true;
  }),
  body("shift.endTime").custom((value) => {
    if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(value)) {
      throw new Error("End time Value must be time with HH:MM format");
    }
    return true;
  }),
];

const updateOffDaysValidatator=[
  body("offDays.*.date")
    .trim()
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage("Date must be in the format yyyy-MM-dd"),
  body("offDays.*.shift.startTime").custom((value) => {
    if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(value)) {
      throw new Error("Start time Value must be time with HH:MM format");
    }
    return true;
  }),
  body("offDays.*.shift.endTime").custom((value) => {
    if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(value)) {
      throw new Error("End time Value must be time with HH:MM format");
    }
    return true;
  }),
]
const consultAppointmentValidator = [
  check("aId", "Invalid object Id appointment Id").custom((value) => {
    return mongoose.isValidObjectId(value);
  }),
  body("prescriptions")
    .isArray()
    .custom((value, { req }) => {
      if (value.length === 0) {
        return true;
      }
      return value.every(
        (item) => typeof item.drug === "string" && item.drug.trim().length > 0
        &&typeof item.dosage === "string" && item.dosage.trim().length > 0
      );
    })
    .withMessage("prescriptions must be an array of non-empty strings"),

  body("testPrescribed")
    .isArray()
    .custom((value, { req }) => {
      if (value.length === 0) {
        return true;
      }
      return value.every(
        (item) => typeof item === "string" && item.trim().length > 0
      );
    })
    .withMessage("testPrescribed must be an array of non-empty strings"),
  body("notes").trim().escape(),

  body("feesStructure")
    .isArray()
    .custom((value, { req }) => {
      return (
        value.length > 0 &&
        value.every((item) => {
          return (
            item.amount &&
            typeof item.amount === "number" &&
            item.feesType &&
            typeof item.feesType === "string" &&
            item.feesType.trim().length > 0
          );
        })
      );
    })
    .withMessage(
      "feesStructure must be an array with non-empty Amount and feesType"
    ),
  body("prescriptions.*.drug").trim().escape(),
  body("prescriptions.*.dosage").trim().escape(),
  body("testPrescribed.*").trim().escape(),
  body("feesStructure.*.amount").trim().escape(),
  body("feesStructure.*.feesType").trim().escape(),
];
const getFeesValidator=[
  check('page').trim().escape()
]
module.exports = {
  updateDoctorProfileValidator,
  getScheduleValidator,
  consultAppointmentValidator,
  updateOffDaysValidatator,
  getFeesValidator,
};
